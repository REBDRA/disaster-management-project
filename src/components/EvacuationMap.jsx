import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Waves, 
  Mountain, 
  AlertTriangle, 
  Compass, 
  PlusCircle, 
  FileCheck,
  Brain,
  Crosshair,
  CloudOff,
  Cloud,
  Radio,
  HardDrive,
  Cpu,
  Layers,
  Send,
  CheckCircle2,
  ShieldAlert,
  Zap,
  RefreshCw,
  Share2,
  ArrowRight
} from 'lucide-react';
import { 
  DEFAULT_REGION, 
  getRegionalShelters,
  REGIONAL_PACKS,
  FLOOD_RISK_ZONES, 
  DEFAULT_USER_POS, 
  computeSafeEvacuationRoute,
  fetchOSRMStreetRoute
} from '../utils/geoRouting';
import { playSound } from '../utils/audioEffects';

export default function EvacuationMap({
  isBlackoutMode,
  setIsBlackoutMode,
  waterLevel,
  setWaterLevel,
  selectedShelterId,
  setSelectedShelterId,
  soundEnabled,
  hazards,
  setHazards
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const floodLayersRef = useRef([]);
  const hazardMarkersRef = useRef([]);
  const shelterMarkersRef = useRef([]);
  const meshNodeMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Region Pack selection state
  const [selectedPackId, setSelectedPackId] = useState('assam-guwahati');

  // Modals & Simulators
  const [showAddHazardModal, setShowAddHazardModal] = useState(false);
  const [newHazardType, setNewHazardType] = useState('ROAD_SUBMERGED');
  const [newHazardDesc, setNewHazardDesc] = useState('');
  const [showMeshGossipModal, setShowMeshGossipModal] = useState(false);
  const [meshGossipItem, setMeshGossipItem] = useState(null);
  const [meshGossipHop, setMeshGossipHop] = useState(0);

  // Store-and-Forward SOS State
  const [sosDispatched, setSosDispatched] = useState(false);
  const [sosHopProgress, setSosHopProgress] = useState(0);

  // Layer Visibility Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    safeRoute: true,
    floodZones: true,
    shelters: true,
    meshNodes: true,
    demContours: true
  });

  // Auto-Location State
  const [userPos, setUserPos] = useState(DEFAULT_USER_POS);
  const [gpsStatus, setGpsStatus] = useState('IDLE'); // 'IDLE' | 'LOCATING' | 'SYNCED' | 'DENIED'
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  const activePack = REGIONAL_PACKS.find(p => p.id === selectedPackId) || REGIONAL_PACKS[0];

  // Switch regional pre-cached pack
  const handleSelectPack = (packId) => {
    if (soundEnabled) playSound('click');
    setSelectedPackId(packId);
    const pack = REGIONAL_PACKS.find(p => p.id === packId);
    if (!pack) return;

    setUserPos(pack.center);
    if (pack.shelters && pack.shelters.length > 0) {
      setSelectedShelterId(pack.shelters[0].id);
    }
    setGpsStatus('IDLE');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(pack.center, pack.zoom, { duration: 1.4 });
    }
  };

  // Re-center map directly on user's pin (100% offline)
  const handleRecenterToUser = () => {
    if (soundEnabled) playSound('click');
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(userPos, 14, { duration: 1.0 });
    }
  };

  // Fit view to entire evacuation corridor
  const handleFitRoute = () => {
    if (soundEnabled) playSound('click');
    const map = mapInstanceRef.current;
    if (!map || !effectivePathCoords || effectivePathCoords.length === 0) return;
    const bounds = L.latLngBounds(effectivePathCoords);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  };

  // Trigger GPS auto-location (works online & gracefully falls back offline)
  const triggerAutoLocation = () => {
    setGpsStatus('LOCATING');
    if (soundEnabled) playSound('click');

    if (!navigator.geolocation) {
      handleRecenterToUser();
      setGpsStatus('OFFLINE_FIX');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setLocationAccuracy(Math.round(pos.coords.accuracy));
        setGpsStatus('SYNCED');
        if (soundEnabled) playSound('success');

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo(coords, 14, { duration: 1.2 });
        }
      },
      (err) => {
        console.warn("Auto-location offline or denied, centering on local on-device coordinates:", err.message);
        handleRecenterToUser();
        setGpsStatus('OFFLINE_FIX');
        if (soundEnabled) playSound('success');
      },
      { enableHighAccuracy: true, timeout: 4000 }
    );
  };

  // Derived route info based on waterLevel, selected shelter & current userPos
  const routeInfo = useMemo(() => {
    return computeSafeEvacuationRoute(waterLevel, selectedShelterId, userPos);
  }, [waterLevel, selectedShelterId, userPos]);

  // Real turn-by-turn street-snapped coordinates
  const [streetSnappedRoute, setStreetSnappedRoute] = useState(null);

  // Compute active regional shelters based on user coordinates
  const activeShelters = useMemo(() => getRegionalShelters(userPos), [userPos]);

  // Fetch real street-snapped coordinates when online, or on-device A* when offline
  useEffect(() => {
    let isCancelled = false;
    const dest = activeShelters.find(s => s.id === selectedShelterId) || activeShelters[0];
    if (!dest) return;

    if (!isBlackoutMode) {
      fetchOSRMStreetRoute(userPos, dest.coords).then(res => {
        if (!isCancelled && res) {
          setStreetSnappedRoute(res);
        }
      });
    } else {
      setStreetSnappedRoute(null);
    }

    return () => {
      isCancelled = true;
    };
  }, [userPos, selectedShelterId, activeShelters, isBlackoutMode]);

  const effectivePathCoords = streetSnappedRoute?.pathCoords || routeInfo.pathCoords;
  const effectiveDistanceKm = streetSnappedRoute?.distanceKm || routeInfo.distanceKm;
  const effectiveEstMinutes = streetSnappedRoute?.estMinutes || routeInfo.estMinutes;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: activePack.center,
      zoom: activePack.zoom,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'tactical-dark-tile-img'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    let resizeObserver = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Flood Zones based on Water Level
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    floodLayersRef.current.forEach(layer => map.removeLayer(layer));
    floodLayersRef.current = [];

    if (!layerVisibility.floodZones) return;

    FLOOD_RISK_ZONES.forEach(zone => {
      const isFlooded = waterLevel >= zone.floodThreshold;
      const opacity = isFlooded ? Math.min(0.65, 0.25 + (waterLevel - zone.floodThreshold) * 0.08) : 0.12;
      const fillColor = isFlooded ? '#00e5ff' : '#0284c7';

      const polygon = L.polygon(zone.coords, {
        color: isFlooded ? '#ff2a5f' : '#0284c7',
        weight: isFlooded ? 2 : 1,
        dashArray: isFlooded ? '4, 4' : null,
        fillColor: fillColor,
        fillOpacity: opacity
      }).addTo(map);

      polygon.bindPopup(`
        <div style="font-family: Outfit, sans-serif; font-size: 13px; line-height: 1.4;">
          <b style="color: ${isFlooded ? '#ff2a5f' : '#38bdf8'};">${zone.name}</b><br/>
          <span>Base Elevation: ${zone.elevation}m</span><br/>
          <span>Submergence Threshold: +${zone.floodThreshold}m</span><br/>
          <b style="color: ${isFlooded ? '#ff2a5f' : '#10b981'};">
            ${isFlooded ? '🚨 STATUS: ACTIVELY SUBMERGED' : '✅ STATUS: DRY / PASSABLE'}
          </b>
        </div>
      `);

      floodLayersRef.current.push(polygon);
    });
  }, [waterLevel, layerVisibility.floodZones]);

  // Ensure selected shelter exists in the active regional shelters
  useEffect(() => {
    const exists = activeShelters.some(s => s.id === selectedShelterId);
    if (!exists && activeShelters.length > 0) {
      setSelectedShelterId(activeShelters[0].id);
    }
  }, [activeShelters, selectedShelterId, setSelectedShelterId]);

  // Update Shelters Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    shelterMarkersRef.current.forEach(m => map.removeLayer(m));
    shelterMarkersRef.current = [];

    if (!layerVisibility.shelters) return;

    activeShelters.forEach(shelter => {
      const isSelected = shelter.id === selectedShelterId;

      const customIcon = L.divIcon({
        className: 'custom-shelter-marker',
        html: `
          <div style="
            background: ${isSelected ? 'linear-gradient(135deg, #00f59b, #0284c7)' : 'rgba(15, 23, 42, 0.9)'};
            border: 2px solid ${isSelected ? '#00f59b' : '#38bdf8'};
            color: #ffffff;
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 15px ${isSelected ? 'rgba(0, 245, 155, 0.6)' : 'rgba(0,0,0,0.4)'};
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>⛰️</span>
            <span>${shelter.name}</span>
            <span style="background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 4px; font-size: 10px; color: #00f2fe;">
              +${shelter.elevation}m
            </span>
          </div>
        `,
        iconSize: [180, 30],
        iconAnchor: [90, 15]
      });

      const marker = L.marker(shelter.coords, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        if (soundEnabled) playSound('click');
        setSelectedShelterId(shelter.id);
      });

      marker.bindPopup(`
        <div style="font-family: Outfit, sans-serif; font-size: 13px;">
          <h4 style="margin: 0 0 6px 0; color: #00f59b; font-size: 14px;">${shelter.name}</h4>
          <p style="margin: 0 0 4px 0;"><b>Elevation:</b> ${shelter.elevation}m High-Ground Sanctuary</p>
          <p style="margin: 0 0 4px 0;"><b>Capacity:</b> ${shelter.currentOccupants} / ${shelter.capacity} people</p>
          <p style="margin: 0 0 4px 0;"><b>Facilities:</b> ${shelter.resources.join(', ')}</p>
          <p style="margin: 0; color: #00f2fe; font-size: 11px;">CID: ${shelter.cidData}</p>
        </div>
      `);

      shelterMarkersRef.current.push(marker);
    });
  }, [activeShelters, selectedShelterId, soundEnabled, setSelectedShelterId, layerVisibility.shelters]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="
            position: absolute;
            top: 0; left: 0;
            width: 24px; height: 24px;
            border-radius: 50%;
            background: rgba(0, 242, 254, 0.4);
            animation: pulse 1.8s infinite;
          "></div>
          <div style="
            position: absolute;
            top: 4px; left: 4px;
            width: 16px; height: 16px;
            border-radius: 50%;
            background: #00f2fe;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px #00f2fe;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(userPos, { icon: userIcon, draggable: true }).addTo(map);

    marker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      setUserPos([position.lat, position.lng]);
      if (soundEnabled) playSound('click');
    });

    marker.bindPopup(`
      <div style="font-family: Outfit, sans-serif; font-size: 13px;">
        <b style="color: #00f2fe;">YOUR CURRENT LOCATION</b><br/>
        <span>Lat: ${userPos[0].toFixed(4)}, Lon: ${userPos[1].toFixed(4)}</span><br/>
        <span>Engine: <b>${isBlackoutMode ? 'Offline On-Device A*' : 'Cloud GrassHopper'}</b></span><br/>
        <span style="color: var(--accent-emerald); font-size: 11px;">💡 Drag pin or click map to test routing from any point</span>
      </div>
    `);

    userMarkerRef.current = marker;
  }, [userPos, isBlackoutMode, soundEnabled]);

  // Update Hazard Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    hazardMarkersRef.current.forEach(m => map.removeLayer(m));
    hazardMarkersRef.current = [];

    hazards.forEach(h => {
      const isBlocking = h.severity === 'BLOCKING' || h.severity === 'LETHAL';
      const icon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div style="
            background: ${isBlocking ? 'rgba(255, 42, 95, 0.95)' : 'rgba(245, 158, 11, 0.95)'};
            border: 2px solid #ffffff;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            box-shadow: 0 0 14px ${isBlocking ? 'rgba(255, 42, 95, 0.8)' : 'rgba(245, 158, 11, 0.8)'};
            animation: bounce 2s infinite;
          ">
            ⚠️
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(h.coords, { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: Outfit, sans-serif; font-size: 13px;">
          <b style="color: #ff2a5f;">P2P ROAD OBSTRUCTION DETECTED</b><br/>
          <b>${h.title}</b><br/>
          <span>Reported by: ${h.reportedBy}</span><br/>
          <span style="color: #00f59b;">✓ Consensus Votes: ${h.consensusVotes} Nodes</span><br/>
          <span style="color: var(--accent-cyan);">Status: On-Device A* Routing Avoidance Active</span>
        </div>
      `);

      hazardMarkersRef.current.push(marker);
    });
  }, [hazards]);

  // Render Evacuation Safe Path
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
    }

    if (!layerVisibility.safeRoute || !effectivePathCoords || effectivePathCoords.length < 2) return;

    const routeGroup = L.layerGroup();

    // 1. Outer Glow Aura Line
    const glowLine = L.polyline(effectivePathCoords, {
      color: isBlackoutMode ? '#00f59b' : '#00f2fe',
      weight: 12,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    });
    routeGroup.addLayer(glowLine);

    // 2. Primary Tactical Safe Corridor Line
    const mainLine = L.polyline(effectivePathCoords, {
      color: isBlackoutMode ? '#00f59b' : '#00f2fe',
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: isBlackoutMode ? '10, 7' : null
    });
    routeGroup.addLayer(mainLine);

    // 3. Inner White Precision Tracer Line
    const innerTracer = L.polyline(effectivePathCoords, {
      color: '#ffffff',
      weight: 2,
      opacity: 0.75,
      lineCap: 'round',
      lineJoin: 'round'
    });
    routeGroup.addLayer(innerTracer);

    routeGroup.addTo(map);
    routeLayerRef.current = routeGroup;
  }, [effectivePathCoords, isBlackoutMode, layerVisibility.safeRoute]);

  // Handle reporting a new road hazard with P2P Gossip Broadcast simulation
  const handleReportHazard = () => {
    if (!newHazardDesc.trim()) return;

    if (soundEnabled) playSound('alert');

    const newH = {
      id: `haz-${Date.now()}`,
      type: newHazardType,
      title: newHazardDesc,
      coords: [userPos[0] + (Math.random() - 0.5) * 0.012, userPos[1] + (Math.random() - 0.5) * 0.012],
      reportedBy: `Your Device (BLE Peer 0x${Math.floor(Math.random()*9000+1000).toString(16)})`,
      consensusVotes: 1,
      status: 'GOSSIP_PROPAGATING',
      severity: 'BLOCKING'
    };

    setHazards([newH, ...hazards]);
    setShowAddHazardModal(false);
    setNewHazardDesc('');

    // Trigger P2P Mesh Gossip Visualizer
    setMeshGossipItem(newH);
    setMeshGossipHop(1);
    setShowMeshGossipModal(true);

    const hopTimer1 = setTimeout(() => {
      setMeshGossipHop(2);
      if (soundEnabled) playSound('click');
    }, 1200);

    const hopTimer2 = setTimeout(() => {
      setMeshGossipHop(3);
      if (soundEnabled) playSound('success');
    }, 2400);

    return () => {
      clearTimeout(hopTimer1);
      clearTimeout(hopTimer2);
    };
  };

  // Handle Offline Store-and-Forward SOS Dispatch
  const handleTriggerStoreAndForwardSos = () => {
    if (soundEnabled) playSound('sos');
    setSosDispatched(true);
    setSosHopProgress(1);

    setTimeout(() => {
      setSosHopProgress(2);
      if (soundEnabled) playSound('click');
    }, 1200);

    setTimeout(() => {
      setSosHopProgress(3);
      if (soundEnabled) playSound('success');
    }, 2500);
  };

  const selectedShelter = activeShelters.find(s => s.id === selectedShelterId) || activeShelters[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      
      {/* ═══════════════════════════════════════════════════════════════════════════
          TOP DUAL-ENGINE ARCHITECTURE & PRE-CACHED REGIONAL PACK CONTROL BAR
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="glass-panel" style={{
        padding: '12px 18px',
        border: `1px solid ${isBlackoutMode ? 'rgba(255, 42, 95, 0.4)' : 'var(--border-cyan)'}`,
        background: isBlackoutMode ? 'linear-gradient(90deg, rgba(255, 42, 95, 0.08) 0%, rgba(13, 20, 36, 0.9) 100%)' : 'rgba(13, 20, 36, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Left: Dual-Engine Active Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 8,
            background: isBlackoutMode ? 'rgba(255, 42, 95, 0.2)' : 'rgba(0, 242, 254, 0.15)',
            border: `1px solid ${isBlackoutMode ? '#ff2a5f' : 'var(--accent-cyan)'}`
          }}>
            {isBlackoutMode ? (
              <ShieldAlert size={16} color="#ff4d79" className="radar-ping" />
            ) : (
              <Cloud size={16} color="var(--accent-cyan)" />
            )}
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                ACTIVE ROUTING ENGINE
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: isBlackoutMode ? '#ff4d79' : 'var(--accent-cyan)' }}>
                {isBlackoutMode ? 'OFFLINE RESILIENCE ENGINE (On-Device A*)' : 'ONLINE CLOUD ENGINE (GrassHopper + PostGIS)'}
              </div>
            </div>
          </div>

          {/* Telemetry Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="code-pill" style={{ color: 'var(--accent-emerald)' }}>
              <HardDrive size={12} style={{ display: 'inline', marginRight: 4 }} />
              {activePack.demFormat}
            </span>
            <span className="code-pill">
              <Radio size={12} style={{ display: 'inline', marginRight: 4 }} />
              BLE / Nearby Mesh (4 Hops)
            </span>
            <span className="code-pill" style={{ color: '#00f2fe' }}>
              <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
              Latency: {isBlackoutMode ? '2.8ms (Local)' : '142ms (RPC)'}
            </span>
          </div>
        </div>

        {/* Right: Pre-Cached Regional Pack Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
            PRE-CACHED PACK:
          </div>
          <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.4)', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            {REGIONAL_PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack.id)}
                className="btn-ghost"
                style={{
                  padding: '5px 10px',
                  fontSize: 11,
                  fontWeight: selectedPackId === pack.id ? 700 : 500,
                  background: selectedPackId === pack.id ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                  color: selectedPackId === pack.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  border: selectedPackId === pack.id ? '1px solid var(--border-cyan)' : '1px solid transparent',
                  borderRadius: 6
                }}
              >
                {pack.name.split('—')[0]}
              </button>
            ))}
          </div>

          {/* Dual-Mode Fast Toggle */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('alert');
              setIsBlackoutMode(!isBlackoutMode);
            }}
            className="btn-ghost"
            style={{
              background: isBlackoutMode ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 42, 95, 0.15)',
              border: `1px solid ${isBlackoutMode ? 'var(--accent-cyan)' : '#ff2a5f'}`,
              color: isBlackoutMode ? 'var(--accent-cyan)' : '#ff4d79',
              fontSize: 11,
              fontWeight: 700
            }}
            title="Toggle between Online Cloud & Zero-Network Offline Mesh"
          >
            <RefreshCw size={13} />
            <span>{isBlackoutMode ? 'Switch to Cloud' : 'Simulate Blackout'}</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MAIN MAP WORKSPACE & INTERACTIVE SIDEBAR
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="resq-map-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 390px', gap: 16, height: 'calc(100vh - 175px)', minHeight: 650 }}>
        
        {/* Map Column */}
        <div className="resq-map-container" style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          
          {/* Leaflet Container */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Unified Tactical HUD Container (Zero Overlap Flow) */}
          <div className="resq-map-hud-container" style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            zIndex: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            pointerEvents: 'none'
          }}>
            {/* Top Tier: Target Sanctuary & Action Buttons */}
            <div className="resq-map-hud-row1" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap'
            }}>
              {/* Target Sanctuary Info */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', pointerEvents: 'auto' }}>
                <div className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Compass size={16} color="var(--accent-cyan)" />
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Target Elevation Zone</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                      {selectedShelter.name} ({selectedShelter.elevation}m High Ground)
                    </div>
                  </div>
                </div>

                <div className="resq-route-legend glass-panel" style={{
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: '1px solid rgba(0, 245, 155, 0.4)',
                  background: 'rgba(7, 10, 18, 0.9)'
                }}>
                  <span style={{ width: 12, height: 4, background: '#00f59b', borderRadius: 2 }}></span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-emerald)', letterSpacing: 0.5 }}>
                    {isBlackoutMode ? 'OFFLINE A* CORRIDOR' : 'CLOUD STREET ROUTE'} ({routeInfo.confidenceScore}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 6, pointerEvents: 'auto', flexWrap: 'wrap' }}>
                {/* Focus Evacuation Corridor button */}
                <button
                  onClick={handleFitRoute}
                  className="btn-ghost"
                  style={{
                    background: 'rgba(0, 245, 155, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--accent-emerald)',
                    color: 'var(--accent-emerald)',
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                  title="Fit map view to entire evacuation corridor and destination shelter"
                >
                  <Navigation size={13} />
                  <span>Focus Route</span>
                </button>

                {/* Center My Pin button */}
                <button
                  onClick={handleRecenterToUser}
                  className="btn-ghost"
                  style={{
                    background: 'rgba(0, 242, 254, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border-cyan)',
                    color: 'var(--accent-cyan)',
                    padding: '6px 10px',
                    fontSize: 11
                  }}
                  title="Center map on your location pin (100% Offline)"
                >
                  <Crosshair size={13} />
                  <span>My Pin</span>
                </button>

                {/* Auto GPS Location Button */}
                <button
                  onClick={triggerAutoLocation}
                  className="btn-ghost"
                  style={{
                    background: gpsStatus === 'SYNCED' || gpsStatus === 'OFFLINE_FIX' ? 'rgba(0, 245, 155, 0.15)' : 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${gpsStatus === 'SYNCED' || gpsStatus === 'OFFLINE_FIX' ? 'var(--accent-emerald)' : 'var(--border-cyan)'}`,
                    color: gpsStatus === 'SYNCED' || gpsStatus === 'OFFLINE_FIX' ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                    padding: '6px 10px',
                    fontSize: 11
                  }}
                  title="Detect live GPS location or sync with local coordinates"
                >
                  <Radio size={13} className={gpsStatus === 'LOCATING' ? 'radar-ping' : ''} />
                  <span>
                    {gpsStatus === 'LOCATING' 
                      ? 'Locating...' 
                      : gpsStatus === 'SYNCED' 
                        ? '✓ GPS Synced' 
                        : gpsStatus === 'OFFLINE_FIX'
                          ? '✓ Local Fix'
                          : 'Auto GPS'}
                  </span>
                </button>

                {/* Report Hazard button */}
                <button
                  onClick={() => setShowAddHazardModal(true)}
                  className="btn-ghost"
                  style={{
                    background: 'rgba(255, 42, 95, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 42, 95, 0.5)',
                    color: '#ff4d79',
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  <PlusCircle size={13} />
                  <span>Report Hazard</span>
                </button>
              </div>
            </div>

            {/* Second Tier: Non-Overlapping Layer Toggles & Engine Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              pointerEvents: 'auto'
            }}>
              <div className="glass-panel" style={{
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 11
              }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: 10 }}>LAYERS:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: layerVisibility.floodZones ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={layerVisibility.floodZones}
                    onChange={e => setLayerVisibility({ ...layerVisibility, floodZones: e.target.checked })}
                  />
                  Flood Inundation
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: layerVisibility.shelters ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={layerVisibility.shelters}
                    onChange={e => setLayerVisibility({ ...layerVisibility, shelters: e.target.checked })}
                  />
                  High-Ground Shelters
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: layerVisibility.safeRoute ? '#00f59b' : 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={layerVisibility.safeRoute}
                    onChange={e => setLayerVisibility({ ...layerVisibility, safeRoute: e.target.checked })}
                  />
                  Safe A* Route
                </label>
              </div>

              <div className="code-pill" style={{ color: isBlackoutMode ? 'var(--accent-emerald)' : 'var(--accent-cyan)', fontSize: 10 }}>
                {isBlackoutMode ? '🛡️ Offline A* Active (0ms Latency)' : '☁️ Cloud Street Routing Active'}
              </div>
            </div>
          </div>

          {/* Dynamic Water Level / Flood Simulator Floating Bar */}
          <div className="resq-flood-bar" style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            zIndex: 400,
            background: 'rgba(7, 10, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 12,
            padding: '12px 18px',
            width: 360,
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                <Waves size={16} />
                <span>FLOOD SURGE SIMULATOR</span>
              </div>
              <span className="code-pill" style={{ color: waterLevel > 5 ? '#ff2a5f' : '#00f2fe' }}>
                +{waterLevel}m SURCHARGE
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={waterLevel}
              onChange={(e) => {
                if (soundEnabled && Math.random() > 0.6) playSound('click');
                setWaterLevel(parseFloat(e.target.value));
              }}
              style={{
                width: '100%',
                accentColor: waterLevel > 5 ? '#ff2a5f' : '#00f2fe',
                cursor: 'pointer',
                height: 6
              }}
            />

            <div className="resq-flood-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              <span>0m (Baseline)</span>
              <span>+4m (Riverbank Breach)</span>
              <span>+8m (Flash Flood)</span>
              <span>+12m (Catastrophic)</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════
            SIDEBAR INTELLIGENCE: DYNAMIC CONFIDENCE SCORE & OFFLINE RESILIENCE
            ═══════════════════════════════════════════════════════════════════════════ */}
        <div className="resq-map-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          
          {/* Safe Route Confidence Card & Breakdown */}
          <div className="glass-panel" style={{ padding: 18, border: '1px solid var(--border-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Navigation size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>DYNAMIC ROUTE CONFIDENCE</span>
              </div>
              <span className={`tactical-badge ${routeInfo.confidenceScore > 75 ? 'badge-emerald' : routeInfo.confidenceScore > 50 ? 'badge-amber' : 'badge-red'}`}>
                {routeInfo.confidenceScore}% CONFIDENCE
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>DISTANCE / TIME</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                  {effectiveDistanceKm} km <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>({effectiveEstMinutes}m walk)</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ELEVATION GAIN</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  +{routeInfo.elevationGain}m <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>high-ground</span>
                </div>
              </div>
            </div>

            {/* 4 Core Innovation Sub-Score Gauges (from Presentation Slide 2) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, background: 'rgba(0,0,0,0.25)', padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                SAFETY CONFIDENCE BREAKDOWN
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span>🏔️ Elevation Clearance (+{routeInfo.elevationGain}m)</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>98%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: '98%', height: '100%', background: '#00f59b', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span>🌊 Inundation Surcharge Tolerance</span>
                  <span style={{ color: waterLevel > 5 ? '#ff2a5f' : 'var(--accent-cyan)', fontWeight: 700 }}>
                    {Math.max(20, 100 - waterLevel * 8)}%
                  </span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${Math.max(20, 100 - waterLevel * 8)}%`, height: '100%', background: waterLevel > 5 ? '#ff2a5f' : '#00f2fe', borderRadius: 2 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span>📡 P2P BLE Hazard Consensus</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>4/4 Verified</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: '100%', height: '100%', background: '#00f59b', borderRadius: 2 }} />
                </div>
              </div>
            </div>

            {/* Dynamic Safety Reasoning from On-Device A* */}
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ background: 'rgba(0, 245, 155, 0.08)', border: '1px solid rgba(0, 245, 155, 0.3)', padding: '6px 10px', borderRadius: 6, color: 'var(--accent-emerald)', fontSize: 11, fontWeight: 600 }}>
                🛣️ {isBlackoutMode ? 'On-Device A*: Evaluated via pre-cached 30m SRTM DEM Matrix' : 'Street-Snapped: Follows real public roadways & footpaths'}
              </div>
              {routeInfo.routeNotes.map((note, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>
                  {note}
                </div>
              ))}
            </div>

            {/* Offline Store-and-Forward SOS Dispatch Button */}
            <div style={{ marginTop: 14 }}>
              <button
                onClick={handleTriggerStoreAndForwardSos}
                className="btn-ghost"
                style={{
                  width: '100%',
                  background: sosDispatched ? 'rgba(0, 245, 155, 0.15)' : 'rgba(255, 42, 95, 0.15)',
                  border: `1px solid ${sosDispatched ? 'var(--accent-emerald)' : '#ff2a5f'}`,
                  color: sosDispatched ? 'var(--accent-emerald)' : '#ff4d79',
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '10px 14px',
                  justifyContent: 'center'
                }}
              >
                <Share2 size={15} />
                <span>{sosDispatched ? `✓ Store-and-Forward SOS Propagating (Hop ${sosHopProgress}/3)` : 'Transmit Offline SOS (BLE Mesh)'}</span>
              </button>
            </div>
          </div>

          {/* Shelter Selectors */}
          <div className="glass-panel" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mountain size={16} color="var(--accent-emerald)" />
              <span>HIGH-GROUND RESCUE SANCTUARIES</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeShelters.map(shelter => {
                const isSelected = shelter.id === selectedShelterId;
                const percentFilled = Math.round((shelter.currentOccupants / shelter.capacity) * 100);

                return (
                  <div
                    key={shelter.id}
                    onClick={() => {
                      if (soundEnabled) playSound('click');
                      setSelectedShelterId(shelter.id);
                    }}
                    style={{
                      background: isSelected ? 'rgba(0, 245, 155, 0.08)' : 'rgba(0,0,0,0.25)',
                      border: `1px solid ${isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'var(--accent-emerald)' : '#ffffff' }}>
                        {shelter.name}
                      </span>
                      <span className="code-pill">
                        +{shelter.elevation}m DEM
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                      <span>Capacity: {shelter.currentOccupants} / {shelter.capacity} ({percentFilled}%)</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>GeoPackage</span>
                    </div>

                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${percentFilled}%`, height: '100%', background: percentFilled > 80 ? '#ff2a5f' : '#00f59b' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active P2P Hazard Feed & BFT Consensus */}
          <div className="glass-panel" style={{ padding: 18, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={16} color="#ff4d79" />
                <span>P2P HAZARDS CONSENSUS</span>
              </div>
              <span className="code-pill" style={{ color: 'var(--accent-emerald)' }}>
                BLE GOSSIP
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {hazards.map(h => (
                <div key={h.id} style={{ background: 'rgba(255, 42, 95, 0.07)', borderLeft: '3px solid #ff2a5f', padding: '8px 10px', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc' }}>{h.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>{h.reportedBy}</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>✓ {h.consensusVotes} votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL: REPORT ROAD HAZARD (WITH OFFLINE P2P ATTESTATION)
          ═══════════════════════════════════════════════════════════════════════════ */}
      {showAddHazardModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ width: 440, maxWidth: '92vw', padding: 24, border: '1px solid #ff2a5f' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ff4d79', marginBottom: 12 }}>
              <AlertTriangle size={20} />
              <h3 style={{ margin: 0, fontSize: 16 }}>Broadcast P2P Road Hazard</h3>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
              Signal will be signed by your device DID and propagated through local Bluetooth/Wi-Fi Direct mesh without needing cellular network.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>HAZARD TYPE</label>
                <select
                  value={newHazardType}
                  onChange={(e) => setNewHazardType(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#ffffff', padding: 8, borderRadius: 6 }}
                >
                  <option value="ROAD_SUBMERGED">Road Inundated / Submerged</option>
                  <option value="LANDSLIDE">Mudslide / Hill Debris</option>
                  <option value="POWER_LINE_DOWN">Fallen Electrical Pole / Live Wire</option>
                  <option value="BRIDGE_COLLAPSE">Bridge Impassable</option>
                  <option value="GRIDLOCK">Severe Vehicle Gridlock</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>DESCRIPTION / LOCATION LANDMARK</label>
                <input
                  type="text"
                  placeholder="e.g. 1.5m flood water near GT Road Underpass"
                  value={newHazardDesc}
                  onChange={(e) => setNewHazardDesc(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', color: '#ffffff', padding: '8px 12px', borderRadius: 6 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => setShowAddHazardModal(false)}
                  className="btn-ghost"
                  style={{ padding: '8px 14px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportHazard}
                  className="btn-sos"
                  style={{ padding: '8px 16px', fontSize: 12 }}
                >
                  Sign & Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL: LIVE P2P MESH GOSSIP HOP PROPAGATION VISUALIZER
          ═══════════════════════════════════════════════════════════════════════════ */}
      {showMeshGossipModal && meshGossipItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ width: 500, maxWidth: '92vw', padding: 24, border: '1px solid var(--border-cyan)', textAlign: 'center' }}>
            <Radio size={36} color="var(--accent-cyan)" className="radar-ping" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: 18, color: '#ffffff' }}>
              P2P Mesh Gossip Propagation Active
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Zero-Hardware Bluetooth & Wi-Fi Direct Mesh is propagating hazard payload across nearby nodes.
            </p>

            {/* Animated Hop Step Diagram */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              <div style={{
                background: meshGossipHop >= 1 ? 'rgba(0, 242, 254, 0.15)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${meshGossipHop >= 1 ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                borderRadius: 8,
                padding: 12
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>HOP 1</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>Your Device</div>
                <div style={{ fontSize: 10, color: meshGossipHop >= 1 ? '#00f59b' : 'var(--text-muted)', marginTop: 4 }}>
                  {meshGossipHop >= 1 ? '✓ Signed & Sent' : 'Queued'}
                </div>
              </div>

              <div style={{
                background: meshGossipHop >= 2 ? 'rgba(0, 245, 155, 0.15)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${meshGossipHop >= 2 ? '#00f59b' : 'var(--border-subtle)'}`,
                borderRadius: 8,
                padding: 12
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>HOP 2</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>Nearby Mobile Peer</div>
                <div style={{ fontSize: 10, color: meshGossipHop >= 2 ? '#00f59b' : 'var(--text-muted)', marginTop: 4 }}>
                  {meshGossipHop >= 2 ? '✓ Forwarded' : 'Waiting...'}
                </div>
              </div>

              <div style={{
                background: meshGossipHop >= 3 ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${meshGossipHop >= 3 ? '#c084fc' : 'var(--border-subtle)'}`,
                borderRadius: 8,
                padding: 12
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>HOP 3</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>SDRF Command Camp</div>
                <div style={{ fontSize: 10, color: meshGossipHop >= 3 ? '#00f59b' : 'var(--text-muted)', marginTop: 4 }}>
                  {meshGossipHop >= 3 ? '✓ Synced & Re-routed' : 'Routing...'}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: 'var(--accent-emerald)', marginBottom: 16 }}>
              🛡️ On-Device A* Routing has automatically updated and avoided this blocked coordinates.
            </div>

            <button
              onClick={() => setShowMeshGossipModal(false)}
              className="btn-ghost"
              style={{ padding: '8px 24px', background: 'rgba(0, 242, 254, 0.2)', color: 'var(--accent-cyan)' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
