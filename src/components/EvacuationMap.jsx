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
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
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

    fetchOSRMStreetRoute(userPos, dest.coords).then(res => {
      if (!isCancelled && res) {
        setStreetSnappedRoute(res);
      }
    }).catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [userPos, selectedShelterId, activeShelters]);

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
        <div style="font-family: Outfit, sans-serif; font-size: 12px; line-height: 1.4;">
          <b style="color: ${isFlooded ? '#e11d48' : '#0284c7'};">${zone.name}</b><br/>
          <span>Base Elevation: ${zone.elevation}m</span><br/>
          <span>Threshold: +${zone.floodThreshold}m</span><br/>
          <b style="color: ${isFlooded ? '#e11d48' : '#059669'};">
            ${isFlooded ? '🚨 STATUS: SUBMERGED' : '✅ STATUS: DRY / PASSABLE'}
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
          <div style="font-family: Outfit, sans-serif; font-size: 12px;">
            <b style="color: ${tZone.color};">${tZone.name}</b><br/>
            <span>Forecast Depth: <b>${tZone.depthMeters}m</b></span><br/>
            <span>Step: <b>${activeTimeline.timeDisplay}</b></span>
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
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 8px ${isSelected ? 'rgba(5, 150, 105, 0.5)' : 'rgba(0,0,0,0.3)'};
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>⛰️</span>
            <span>${shelter.name.split(' ')[0]}</span>
            <span style="color: #38bdf8; font-size: 9px;">+${shelter.elevation}m</span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      const marker = L.marker(shelter.coords, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        if (soundEnabled) playSound('click');
        setSelectedShelterId(shelter.id);
      });

      marker.bindPopup(`
        <div style="font-family: Outfit, sans-serif; font-size: 12px;">
          <h4 style="margin: 0 0 4px 0; color: #059669; font-size: 13px;">${shelter.name}</h4>
          <p style="margin: 0 0 2px 0;">Elevation: <b>${shelter.elevation}m</b></p>
          <p style="margin: 0 0 2px 0;">Capacity: <b>${shelter.currentOccupants} / ${shelter.capacity}</b></p>
          <p style="margin: 0; color: #0284c7; font-size: 10px;">${shelter.adminUnit}</p>
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
        <div style="position: relative; width: 20px; height: 20px;">
          <div style="
            position: absolute;
            top: 0; left: 0;
            width: 20px; height: 20px;
            border-radius: 50%;
            background: rgba(37, 99, 235, 0.4);
            animation: pulse 1.8s infinite;
          "></div>
          <div style="
            position: absolute;
            top: 3px; left: 3px;
            width: 14px; height: 14px;
            border-radius: 50%;
            background: #2563eb;
            border: 2px solid #ffffff;
            box-shadow: 0 0 8px #2563eb;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker(userPos, { icon: userIcon, draggable: true }).addTo(map);

    marker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      setUserPos([position.lat, position.lng]);
      if (soundEnabled) playSound('click');
    });

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
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 0 10px ${isBlocking ? 'rgba(225, 29, 72, 0.7)' : 'rgba(217, 119, 6, 0.7)'};
          ">
            ⚠️
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(h.coords, { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: Outfit, sans-serif; font-size: 12px;">
          <b style="color: #e11d48;">ROAD OBSTRUCTION</b><br/>
          <b>${h.title}</b><br/>
          <span style="color: var(--accent-cyan);">Avoidance Routing Active</span>
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
      weight: 4,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      
      {/* 48-Hour Flood Timeline Forecast Bar (Zero-Overflow Class Layout) */}
      <div className="resq-card-panel" style={{ border: '1px solid var(--border-cyan)' }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <Waves size={14} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                Flood Timeline
              </span>
              <span className="tactical-badge badge-red" style={{ fontSize: 8, padding: '1px 4px' }}>
                48h Forecast
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setIsSimPlaying(!isSimPlaying);
              }}
              className="btn-primary"
              style={{ padding: '4px 8px', fontSize: 10, minHeight: 'unset' }}
            >
              {isSimPlaying ? <Pause size={10} /> : <Play size={10} />}
              <span>{isSimPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={handleFitRoute}
              className="btn-ghost"
              style={{ padding: '4px 8px', fontSize: 10, minHeight: 'unset' }}
              title="Fit route"
            >
              <Navigation size={10} />
              <span>Fit</span>
            </button>
          </div>
        </div>

        {/* Timeline 6-Button Grid (Exact 3-col on Mobile, 6-col on Desktop) */}
        <div className="resq-timeline-grid">
          {TIMELINE_FORECAST_STEPS.map((step, idx) => {
            const isSelected = idx === timelineIndex;
            return (
              <button
                key={step.hourOffset}
                onClick={() => handleTimelineStepClick(idx)}
                className="resq-timeline-step-btn"
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.18)' : 'var(--bg-tertiary)',
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)'
                }}
              >
                <div className="resq-timeline-step-label" style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {step.label}
                </div>
                <div className="resq-timeline-step-val" style={{ color: isSelected ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                  +{step.waterRiseMeters}m
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* District Selector & Action Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        <div style={{ display: 'flex', gap: 6, width: '100%' }}>
          <select
            value={selectedPackId}
            onChange={(e) => handleSelectPack(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '6px 8px',
              borderRadius: 8,
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 11,
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {REGIONAL_PACKS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={triggerAutoLocation}
            className="btn-ghost"
            style={{ padding: '6px 10px', fontSize: 11, flexShrink: 0 }}
          >
            <Crosshair size={13} color="var(--accent-cyan)" />
            <span>Locate</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) playSound('click');
            setShowAddHazardModal(true);
          }}
          className="resq-action-btn resq-action-secondary"
          style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)', width: '100%' }}
        >
          <PlusCircle size={13} />
          <span>Report Road Submersion</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="resq-map-frame">
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Route Telemetry & ETA Stats Stack (Reference Mobile Style) */}
      <div className="resq-stat-grid">
        
        {/* Metric 1: Distance & Walking ETA */}
        <div className="resq-stat-card">
          <div className="resq-stat-card-left">
            <span className="resq-stat-label">EVACUATION ROUTE DISTANCE</span>
            <div className="resq-stat-value" style={{ color: 'var(--accent-blue)' }}>
              {effectiveDistanceKm} km
            </div>
            <span className="resq-stat-subtext">
              ~{effectiveEstMinutes} mins walking to ridge
            </span>
          </div>
          <div className="resq-stat-icon-box" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)' }}>
            <Navigation size={20} />
          </div>
        </div>

        {/* Metric 2: Elevation & Ridge Safety */}
        <div className="resq-stat-card">
          <div className="resq-stat-card-left">
            <span className="resq-stat-label">AVERAGE SAFE ELEVATION</span>
            <div className="resq-stat-value" style={{ color: 'var(--accent-emerald)' }}>
              +{routeInfo.avgElevation} m
            </div>
            <span className="resq-stat-subtext" style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
              ✓ High ground safety confirmed
            </span>
          </div>
          <div className="resq-stat-icon-box" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--accent-emerald)' }}>
            <Mountain size={20} />
          </div>
        </div>

      </div>

      {/* Designated High-Ground Shelters Stack */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>
          Designated Elevated Sanctuaries ({activeShelters.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {activeShelters.map((shelter) => {
            const isSelected = shelter.id === selectedShelterId;
            return (
              <div
                key={shelter.id}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setSelectedShelterId(shelter.id);
                }}
                className="resq-card-panel"
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-card)',
                  padding: '10px 12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {shelter.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                      Capacity: <b>{shelter.currentOccupants}/{shelter.capacity}</b> ({Math.round((shelter.currentOccupants/shelter.capacity)*100)}%)
                    </div>
                  </div>
                  <span className="tactical-badge badge-emerald" style={{ fontSize: 9, flexShrink: 0 }}>
                    +{shelter.elevation}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Hazard Modal */}
      {showAddHazardModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12
        }}>
          <div className="resq-card-panel" style={{ width: '100%', maxWidth: 400, padding: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
              Report Road Submersion
            </h3>

            <form onSubmit={handleAddHazardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 2 }}>
                  HAZARD CATEGORY
                </label>
                <select
                  value={newHazardType}
                  onChange={(e) => setNewHazardType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12
                  }}
                >
                  <option value="ROAD_SUBMERGED">Road Inundated / Submerged</option>
                  <option value="LANDSLIDE">Mudslide / Hill Debris</option>
                  <option value="POWER_LINE_DOWN">Fallen Electric Wire</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 2 }}>
                  LOCATION & WATER DEPTH
                </label>
                <input
                  type="text"
                  value={newHazardDesc}
                  onChange={(e) => setNewHazardDesc(e.target.value)}
                  placeholder="e.g. Flooded with ~1.5m water"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
