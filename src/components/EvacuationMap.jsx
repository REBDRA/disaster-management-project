import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Waves, 
  Mountain, 
  AlertTriangle, 
  Compass, 
  PlusCircle, 
  Crosshair, 
  CloudOff, 
  Cloud, 
  Radio, 
  HardDrive, 
  Layers, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  Share2, 
  ArrowRight,
  Clock,
  Play,
  Pause,
  TrendingUp,
  MapPin,
  Sparkles
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
import { TIMELINE_FORECAST_STEPS, RIVER_BASINS, SECTOR_FLOOD_PREDICTIONS } from '../utils/floodForecastEngine';
import { queueOfflineHazard } from '../utils/offlineManager';
import { playSound } from '../utils/audioEffects';

export default function EvacuationMap({
  theme = 'light',
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
  const tileLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const floodLayersRef = useRef([]);
  const hazardMarkersRef = useRef([]);
  const shelterMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Region Pack selection state
  const [selectedPackId, setSelectedPackId] = useState('assam-guwahati');

  // Timeline Forecast State
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isSimPlaying, setIsSimPlaying] = useState(false);

  // Modals & Simulators
  const [showAddHazardModal, setShowAddHazardModal] = useState(false);
  const [newHazardType, setNewHazardType] = useState('ROAD_SUBMERGED');
  const [newHazardDesc, setNewHazardDesc] = useState('');

  // Layer Visibility Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    safeRoute: true,
    floodZones: true,
    shelters: true,
    riverGauges: true
  });

  // Auto-Location State
  const [userPos, setUserPos] = useState(DEFAULT_USER_POS);
  const [gpsStatus, setGpsStatus] = useState('IDLE');
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  const activePack = REGIONAL_PACKS.find(p => p.id === selectedPackId) || REGIONAL_PACKS[0];
  const activeTimeline = TIMELINE_FORECAST_STEPS[timelineIndex];
  const activeBasin = RIVER_BASINS.find(b => b.id.includes(selectedPackId.split('-')[0])) || RIVER_BASINS[0];

  // Auto-play timeline simulation
  useEffect(() => {
    let interval = null;
    if (isSimPlaying) {
      interval = setInterval(() => {
        setTimelineIndex(prev => {
          const next = (prev + 1) % TIMELINE_FORECAST_STEPS.length;
          setWaterLevel(TIMELINE_FORECAST_STEPS[next].waterRiseMeters);
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSimPlaying, setWaterLevel]);

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
      mapInstanceRef.current.flyTo(pack.center, pack.zoom, { duration: 1.2 });
    }
  };

  const handleTimelineStepClick = (index) => {
    if (soundEnabled) playSound('click');
    setTimelineIndex(index);
    setWaterLevel(TIMELINE_FORECAST_STEPS[index].waterRiseMeters);
  };

  const handleRecenterToUser = () => {
    if (soundEnabled) playSound('click');
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(userPos, 14, { duration: 1.0 });
    }
  };

  const handleFitRoute = () => {
    if (soundEnabled) playSound('click');
    const map = mapInstanceRef.current;
    if (!map || !effectivePathCoords || effectivePathCoords.length === 0) return;
    const bounds = L.latLngBounds(effectivePathCoords);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  };

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
        console.warn("Location offline/denied, fallback to local district center:", err.message);
        handleRecenterToUser();
        setGpsStatus('OFFLINE_FIX');
        if (soundEnabled) playSound('success');
      },
      { enableHighAccuracy: true, timeout: 4000 }
    );
  };

  // Route calculation
  const routeInfo = useMemo(() => {
    return computeSafeEvacuationRoute(waterLevel, selectedShelterId, userPos);
  }, [waterLevel, selectedShelterId, userPos]);

  const [streetSnappedRoute, setStreetSnappedRoute] = useState(null);
  const activeShelters = useMemo(() => getRegionalShelters(userPos), [userPos]);

  useEffect(() => {
    let isCancelled = false;
    const dest = activeShelters.find(s => s.id === selectedShelterId) || activeShelters[0];
    if (!dest) return;

    fetchOSSRMRouteSafe(userPos, dest.coords).then(res => {
      if (!isCancelled && res) {
        setStreetSnappedRoute(res);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [userPos, selectedShelterId, activeShelters]);

  async function fetchOSSRMRouteSafe(start, dest) {
    try {
      return await fetchOSRMStreetRoute(start, dest);
    } catch {
      return null;
    }
  }

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
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: theme === 'dark' ? 'tactical-dark-tile-img' : ''
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map tile class on theme change
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const container = tileLayerRef.current.getContainer();
    if (container) {
      if (theme === 'dark') {
        container.classList.add('tactical-dark-tile-img');
      } else {
        container.classList.remove('tactical-dark-tile-img');
      }
    }
  }, [theme]);

  // Update Flood Inundation Layers based on Water Level & Timeline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    floodLayersRef.current.forEach(layer => map.removeLayer(layer));
    floodLayersRef.current = [];

    if (!layerVisibility.floodZones) return;

    // Render Base Flood Risk Polygons
    FLOOD_RISK_ZONES.forEach(zone => {
      const isFlooded = waterLevel >= zone.floodThreshold;
      const opacity = isFlooded ? Math.min(0.65, 0.25 + (waterLevel - zone.floodThreshold) * 0.08) : 0.12;
      const fillColor = isFlooded ? '#e11d48' : '#0284c7';

      const polygon = L.polygon(zone.coords, {
        color: isFlooded ? '#e11d48' : '#0284c7',
        weight: isFlooded ? 2 : 1,
        dashArray: isFlooded ? '4, 4' : null,
        fillColor: fillColor,
        fillOpacity: opacity
      }).addTo(map);

      polygon.bindPopup(`
        <div style="font-family: Outfit, sans-serif; font-size: 13px; line-height: 1.4;">
          <b style="color: ${isFlooded ? '#e11d48' : '#0284c7'};">${zone.name}</b><br/>
          <span>Base Elevation: ${zone.elevation}m</span><br/>
          <span>Submergence Threshold: +${zone.floodThreshold}m</span><br/>
          <b style="color: ${isFlooded ? '#e11d48' : '#059669'};">
            ${isFlooded ? '🚨 STATUS: ACTIVELY SUBMERGED' : '✅ STATUS: DRY / PASSABLE'}
          </b>
        </div>
      `);

      floodLayersRef.current.push(polygon);
    });

    // Render Timeline Specific Inundation Extent if available
    if (activeTimeline && activeTimeline.inundationZones) {
      activeTimeline.inundationZones.forEach(tZone => {
        const poly = L.polygon(tZone.coords, {
          color: tZone.color || '#ef4444',
          weight: 2,
          fillColor: tZone.color || '#ef4444',
          fillOpacity: tZone.fillOpacity || 0.45
        }).addTo(map);

        poly.bindPopup(`
          <div style="font-family: Outfit, sans-serif; font-size: 13px;">
            <b style="color: ${tZone.color};">${tZone.name}</b><br/>
            <span>Forecast Depth: <b>${tZone.depthMeters} meters</b></span><br/>
            <span>Timeline Step: <b>${activeTimeline.timeDisplay}</b></span>
          </div>
        `);
        floodLayersRef.current.push(poly);
      });
    }

  }, [waterLevel, layerVisibility.floodZones, activeTimeline]);

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
            background: ${isSelected ? 'linear-gradient(135deg, #059669, #0284c7)' : 'rgba(15, 23, 42, 0.9)'};
            border: 2px solid ${isSelected ? '#059669' : '#0284c7'};
            color: #ffffff;
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 15px ${isSelected ? 'rgba(5, 150, 105, 0.5)' : 'rgba(0,0,0,0.3)'};
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>⛰️</span>
            <span>${shelter.name}</span>
            <span style="background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 4px; font-size: 10px; color: #38bdf8;">
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
          <h4 style="margin: 0 0 6px 0; color: #059669; font-size: 14px;">${shelter.name}</h4>
          <p style="margin: 0 0 4px 0;"><b>Elevation:</b> ${shelter.elevation}m High-Ground Sanctuary</p>
          <p style="margin: 0 0 4px 0;"><b>Capacity:</b> ${shelter.currentOccupants} / ${shelter.capacity} people</p>
          <p style="margin: 0 0 4px 0;"><b>Facilities:</b> ${shelter.resources.join(', ')}</p>
          <p style="margin: 0; color: #0284c7; font-size: 11px;">Admin: ${shelter.adminUnit}</p>
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
            background: rgba(37, 99, 235, 0.4);
            animation: pulse 1.8s infinite;
          "></div>
          <div style="
            position: absolute;
            top: 4px; left: 4px;
            width: 16px; height: 16px;
            border-radius: 50%;
            background: #2563eb;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px #2563eb;
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
        <b style="color: #2563eb;">YOUR CITIZEN LOCATION</b><br/>
        <span>Lat: ${userPos[0].toFixed(4)}, Lon: ${userPos[1].toFixed(4)}</span><br/>
        <span>Elevation Routing: <b>${isBlackoutMode ? 'Offline On-Device Engine' : 'Web2 Live Routing'}</b></span><br/>
        <span style="color: var(--accent-emerald); font-size: 11px;">💡 Drag pin anywhere to test evacuation route</span>
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
            background: ${isBlocking ? 'rgba(225, 29, 72, 0.95)' : 'rgba(217, 119, 6, 0.95)'};
            border: 2px solid #ffffff;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            box-shadow: 0 0 14px ${isBlocking ? 'rgba(225, 29, 72, 0.7)' : 'rgba(217, 119, 6, 0.7)'};
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
          <b style="color: #e11d48;">ROAD OBSTRUCTION / FLOOD HAZARD</b><br/>
          <b>${h.title}</b><br/>
          <span>Reported by: ${h.reportedBy}</span><br/>
          <span style="color: #059669;">✓ Verified Field Reports: ${h.verifiedReports}</span><br/>
          <span style="color: var(--accent-cyan);">Adaptive Elevation Route Avoidance Active</span>
        </div>
      `);

      hazardMarkersRef.current.push(marker);
    });
  }, [hazards]);

  // Render Evacuation Route Line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (!layerVisibility.safeRoute || !effectivePathCoords || effectivePathCoords.length < 2) return;

    const polyline = L.polyline(effectivePathCoords, {
      color: '#059669',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    routeLayerRef.current = polyline;
  }, [effectivePathCoords, layerVisibility.safeRoute]);

  const handleAddHazardSubmit = (e) => {
    e.preventDefault();
    if (!newHazardDesc) return;

    const newHaz = {
      id: `haz-${Date.now()}`,
      type: newHazardType,
      title: newHazardDesc,
      coords: [userPos[0] + 0.003, userPos[1] + 0.003],
      reportedBy: 'Citizen Volunteer #42',
      verifiedReports: 1,
      status: 'CONFIRMED_HAZARD',
      severity: newHazardType === 'ROAD_SUBMERGED' ? 'BLOCKING' : 'CAUTION',
      reportedAt: 'Just now'
    };

    queueOfflineHazard(newHaz);
    setHazards(prev => [newHaz, ...prev]);
    setShowAddHazardModal(false);
    setNewHazardDesc('');
    if (soundEnabled) playSound('success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* 48-Hour Flood Timeline Prediction & Interactive Simulation Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', border: '1px solid var(--border-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Waves size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Flood Inundation & Timeline Prediction Map
                </span>
                <span className="tactical-badge badge-red">
                  WHERE & WHEN FLOODS OCCUR
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Scrub through timeline steps to visualize rising floodwaters and dynamic evacuation route bypasses.
              </span>
            </div>
          </div>

          {/* Timeline Play / Pause / Recenter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setIsSimPlaying(!isSimPlaying);
              }}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              {isSimPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isSimPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={handleFitRoute}
              className="btn-ghost"
              style={{ padding: '6px 10px', fontSize: 12 }}
              title="Fit entire evacuation path in view"
            >
              <Navigation size={13} />
              <span>Fit Route</span>
            </button>
          </div>

        </div>

        {/* Timeline Step Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 6
        }}>
          {TIMELINE_FORECAST_STEPS.map((step, idx) => {
            const isSelected = idx === timelineIndex;
            return (
              <button
                key={step.hourOffset}
                onClick={() => handleTimelineStepClick(idx)}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-tertiary)',
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '8px 6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'var(--accent-red)' : 'var(--text-primary)', marginTop: 2 }}>
                  +{step.waterRiseMeters}m Rise
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Control Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        
        {/* District Pack Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>DISTRICT:</span>
          <select
            value={selectedPackId}
            onChange={(e) => handleSelectPack(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 12
            }}
          >
            {REGIONAL_PACKS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Action Controls: GPS Pinpoint, Report Hazard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={triggerAutoLocation}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            <Crosshair size={14} color="var(--accent-cyan)" />
            <span>{gpsStatus === 'LOCATING' ? 'Locating...' : 'Locate Me'}</span>
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              setShowAddHazardModal(true);
            }}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: 12, borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
          >
            <PlusCircle size={14} />
            <span>Report Road Submersion</span>
          </button>
        </div>

      </div>

      {/* Main Map Container */}
      <div style={{ position: 'relative', width: '100%', height: 520, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-card)' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Overlay Telemetry Card (Top Left of Map) */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 400,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          borderRadius: 12,
          maxWidth: 320,
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>LIVE ROUTE TELEMETRY</span>
            <span className="tactical-badge badge-emerald">
              <CheckCircle2 size={10} /> HIGH GROUND SAFE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              {effectiveDistanceKm} km
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              (~{effectiveEstMinutes} mins walking)
            </span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Average Elevation: <b style={{ color: 'var(--accent-emerald)' }}>+{routeInfo.avgElevation}m</b> (Gain: +{routeInfo.elevationGain}m)
          </div>

          {routeInfo.routeNotes && routeInfo.routeNotes.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6 }}>
              {routeInfo.routeNotes[0]}
            </div>
          )}
        </div>

        {/* Sector Inundation ETA Countdown Card (Bottom Left of Map) */}
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          zIndex: 400,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          padding: '10px 14px',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(225, 29, 72, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-red)'
          }}>
            <Clock size={16} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-red)' }}>
              BREACH ETA: ZONE 2 INUNDATION IN 1h 45m
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
              Water rise: +{waterLevel}m • Peak crest expected at 19:30 IST
            </div>
          </div>
        </div>

      </div>

      {/* High-Ground Evacuation Shelter Cards */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10, color: 'var(--text-primary)' }}>
          Designated Elevated High-Ground Sanctuaries ({activeShelters.length} Available)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {activeShelters.map((shelter) => {
            const isSelected = shelter.id === selectedShelterId;
            return (
              <div
                key={shelter.id}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setSelectedShelterId(shelter.id);
                }}
                className="glass-panel"
                style={{
                  padding: 16,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-card)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {shelter.name}
                  </h4>
                  <span className="tactical-badge badge-emerald">
                    +{shelter.elevation}m
                  </span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Capacity: <b>{shelter.currentOccupants} / {shelter.capacity}</b> ({Math.round((shelter.currentOccupants/shelter.capacity)*100)}% Full)
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {shelter.resources.slice(0, 3).map((res, i) => (
                    <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Road Submersion Modal */}
      {showAddHazardModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: 440, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              Report Road Submersion / Hazard
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Reports are saved locally to IndexedDB when offline and broadcast to emergency responders.
            </p>

            <form onSubmit={handleAddHazardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  HAZARD CATEGORY
                </label>
                <select
                  value={newHazardType}
                  onChange={(e) => setNewHazardType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13
                  }}
                >
                  <option value="ROAD_SUBMERGED">Road Inundated / Submerged</option>
                  <option value="LANDSLIDE">Mudslide / Hill Debris</option>
                  <option value="POWER_LINE_DOWN">Fallen Electric Wire</option>
                  <option value="BRIDGE_COLLAPSE">Culvert / Bridge Impassable</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  LOCATION DETAILS & WATER DEPTH
                </label>
                <input
                  type="text"
                  value={newHazardDesc}
                  onChange={(e) => setNewHazardDesc(e.target.value)}
                  placeholder="e.g. Underpass flooded with ~1.5m standing water"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddHazardModal(false)}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
