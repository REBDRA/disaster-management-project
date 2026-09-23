import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Droplets, 
  Wind, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { RIVER_BASINS, TIMELINE_FORECAST_STEPS, SECTOR_FLOOD_PREDICTIONS } from '../utils/floodForecastEngine';
import { playSound } from '../utils/audioEffects';

export default function FloodForecastDashboard({ soundEnabled, onSelectTimelineHour, selectedTimelineHour = 0 }) {
  const [selectedBasinId, setSelectedBasinId] = useState('brahmaputra-assam');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeBasin = RIVER_BASINS.find(b => b.id === selectedBasinId) || RIVER_BASINS[0];
  const activeStep = TIMELINE_FORECAST_STEPS[currentStepIndex];

  // Auto-play timeline simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          const next = (prev + 1) % TIMELINE_FORECAST_STEPS.length;
          if (onSelectTimelineHour) {
            onSelectTimelineHour(TIMELINE_FORECAST_STEPS[next].hourOffset);
          }
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onSelectTimelineHour]);

  const handleStepClick = (index) => {
    if (soundEnabled) playSound('click');
    setCurrentStepIndex(index);
    if (onSelectTimelineHour) {
      onSelectTimelineHour(TIMELINE_FORECAST_STEPS[index].hourOffset);
    }
  };

  const togglePlay = () => {
    if (soundEnabled) playSound('click');
    setIsPlaying(!isPlaying);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'MODERATE':
        return <span className="tactical-badge badge-cyan">MODERATE RISK</span>;
      case 'HIGH':
        return <span className="tactical-badge badge-amber">HIGH INUNDATION</span>;
      case 'CRITICAL':
        return <span className="tactical-badge badge-red">CRITICAL DANGER</span>;
      case 'SEVERE_EMERGENCY':
        return <span className="tactical-badge badge-red" style={{ animation: 'pulse-sos 1.5s infinite' }}>MAX PEAK CREST</span>;
      default:
        return <span className="tactical-badge badge-cyan">{severity}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Waves size={20} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              AI Flood Early Warning & Inundation Timeline Center
            </h1>
            <span className="tactical-badge badge-cyan">
              CENTRAL WATER COMMISSION TELEMETRY
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Real-time hydrological river gauge modeling, dynamic 48-hour flood surge simulation, and high-ground evacuation ETAs.
          </p>
        </div>

        {/* River Basin Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
            SELECT RIVER BASIN:
          </label>
          <select
            value={selectedBasinId}
            onChange={(e) => {
              if (soundEnabled) playSound('click');
              setSelectedBasinId(e.target.value);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {RIVER_BASINS.map(basin => (
              <option key={basin.id} value={basin.id}>
                {basin.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Telemetry Gauges + 48h Timeline Forecast */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        
        {/* River Level Gauge Card */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                LIVE RIVER GAUGE
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0 0' }}>
                {activeBasin.riverName} Water Mark
              </h3>
            </div>
            <span className="tactical-badge badge-red">
              <TrendingUp size={12} /> {activeBasin.trendRatePerHour}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0' }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-red)' }}>
              {activeBasin.currentLevelMeters} m
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              (Danger Level: {activeBasin.dangerLevelMeters} m)
            </span>
          </div>

          {/* Progress Bar vs Danger Mark */}
          <div style={{ width: '100%', height: 10, background: 'var(--bg-tertiary)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: `${Math.min(100, (activeBasin.currentLevelMeters / activeBasin.hflMeters) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-red))',
              borderRadius: 6,
              transition: 'width 0.5s ease'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
            <span>Warning: {activeBasin.warningLevelMeters}m</span>
            <span>Danger: {activeBasin.dangerLevelMeters}m</span>
            <span>Record HFL: {activeBasin.hflMeters}m</span>
          </div>
        </div>

        {/* Rainfall & Discharge Telemetry */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                METEOROLOGICAL INFLUX
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0 0' }}>
                Precipitation & Discharge
              </h3>
            </div>
            <span className="tactical-badge badge-cyan">
              <Droplets size={12} /> CWC RADAR
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>24h Catchment Rain</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-blue)', marginTop: 2 }}>
                {activeBasin.rainfallLast24hMm} mm
              </div>
              <span style={{ fontSize: 10, color: 'var(--accent-red)', fontWeight: 600 }}>Forecast +{activeBasin.forecastNext24hMm}mm</span>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>River Discharge</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 2 }}>
                {activeBasin.dischargeCusecs.toLocaleString()}
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Cusecs Flow Rate</span>
            </div>
          </div>
        </div>

        {/* Peak Inundation ETA Countdown */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                EARLY WARNING TIME HORIZON
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0 0' }}>
                Peak Inundation Window
              </h3>
            </div>
            <span className="tactical-badge badge-amber">
              <Clock size={12} /> COUNTDOWN
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: 'rgba(225, 29, 72, 0.12)',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-red)'
            }}>
              <AlertTriangle size={28} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-red)' }}>
                {activeBasin.peakInundationEtaHours} Hours
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Estimated time until peak flood crest reaches urban embankment
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: 6 }}>
            🛡️ Immediate evacuation advice active for zones under 52m contour
          </div>
        </div>

      </div>

      {/* 48-Hour Inundation Timeline Slider & Player */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={20} color="var(--accent-cyan)" />
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
                48-Hour Inundation Timeline & Forecast Simulation
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Scrub through the timeline to see water level rise, submerged roads, and flood progression.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={togglePlay}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: 12 }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause Simulation' : 'Auto Play Simulation'}</span>
            </button>
            <button
              onClick={() => handleStepClick(0)}
              className="btn-ghost"
              style={{ padding: '8px 12px' }}
              title="Reset to Now"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Timeline Steps Buttons / Horizontal Track */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 8,
          marginBottom: 16
        }}>
          {TIMELINE_FORECAST_STEPS.map((step, idx) => {
            const isSelected = idx === currentStepIndex;
            return (
              <button
                key={step.hourOffset}
                onClick={() => handleStepClick(idx)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.18), rgba(37, 99, 235, 0.18))' : 'var(--bg-tertiary)',
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: '12px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  +{step.waterRiseMeters}m
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {step.submergedRoadsCount} Roads Flooded
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Timeline Step Details */}
        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 12,
          padding: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeStep.timeDisplay}
              </span>
              {getSeverityBadge(activeStep.severity)}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
              {activeStep.summary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Water Level Surcharge</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-red)' }}>
                +{activeStep.waterRiseMeters} Meters
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Estimated At-Risk Pop.</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-amber)' }}>
                {activeStep.affectedPopulationEst.toLocaleString()} Citizens
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Discharge Volume</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-blue)' }}>
                {activeStep.riverDischargeCusecs.toLocaleString()} cusecs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sector-by-Sector Prediction Table: "Where is the flood going on and when is it gonna happen" */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <MapPin size={20} color="var(--accent-red)" />
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Sector Inundation Forecast & Evacuation Priorities
            </h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Precise timeline breakdown showing where inundation occurs and exact breach ETAs.
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Sector / Zone</th>
                <th style={{ padding: '10px 14px' }}>Inundation Status</th>
                <th style={{ padding: '10px 14px' }}>Projected Water Depth</th>
                <th style={{ padding: '10px 14px' }}>When Flood Arrives (Breach ETA)</th>
                <th style={{ padding: '10px 14px' }}>Recommended High Ground</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_FLOOD_PREDICTIONS.map((sec, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '14px', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: sec.riskLevel === 'CRITICAL' ? 'var(--accent-red)' :
                                   sec.riskLevel === 'HIGH_ALERT' ? 'var(--accent-amber)' :
                                   sec.riskLevel === 'WARNING' ? 'var(--accent-cyan)' : 'var(--accent-emerald)'
                      }} />
                      {sec.sector}
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {sec.status === 'SUBMERGED_NOW' && <span className="tactical-badge badge-red">SUBMERGED NOW</span>}
                    {sec.status === 'IMMINENT_SURGE' && <span className="tactical-badge badge-amber">IMMINENT (1-2h)</span>}
                    {sec.status === 'PROJECTED_INUNDATION' && <span className="tactical-badge badge-cyan">INUNDATION IN 4h</span>}
                    {sec.status === 'SAFE_HIGH_GROUND' && <span className="tactical-badge badge-emerald">SAFE HIGH RIDGE</span>}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: sec.submergenceDepth.includes('0') ? 'var(--accent-emerald)' : 'var(--accent-red)' }}>
                    {sec.submergenceDepth}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sec.breachTime}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sec.etaToCrest}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ArrowUpRight size={14} />
                      {sec.recommendedHighGround}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
