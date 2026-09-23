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
  ArrowUpRight,
  Zap,
  Radio
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Flood Early Warning
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            AI Hydrological early warnings, CWC river gauge analytics & 48h surge forecast
          </p>
        </div>

        {/* River Basin Selector */}
        <select
          value={selectedBasinId}
          onChange={(e) => {
            if (soundEnabled) playSound('click');
            setSelectedBasinId(e.target.value);
          }}
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            border: '1px solid var(--border-medium)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {RIVER_BASINS.map(basin => (
            <option key={basin.id} value={basin.id}>
              {basin.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Action Button (Reference Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        <button
          onClick={togglePlay}
          className="action-pill-btn action-pill-primary"
        >
          {isPlaying ? <Pause size={15} /> : <Zap size={15} />}
          <span>{isPlaying ? 'Pause 48h AI Simulation' : 'Run 48h Inundation Simulation'}</span>
        </button>

        <button
          onClick={() => handleStepClick(0)}
          className="action-pill-btn action-pill-secondary"
        >
          <RotateCcw size={15} />
          <span>Reset to Live Observation (T+0h)</span>
        </button>
      </div>

      {/* Stat Cards Stack (Reference Mobile Dashboard Standard) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        
        {/* Stat Card 1: River Water Mark */}
        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">LIVE RIVER WATER LEVEL</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>
              {activeBasin.currentLevelMeters} m
            </div>
            <span className="stat-card-subtext">
              Danger Mark: {activeBasin.dangerLevelMeters}m ({activeBasin.trendRatePerHour})
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-red)' }}>
            <Waves size={24} />
          </div>
        </div>

        {/* Stat Card 2: 24h Catchment Rainfall */}
        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">24H PRECIPITATION INFLUX</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-blue)' }}>
              {activeBasin.rainfallLast24hMm} mm
            </div>
            <span className="stat-card-subtext">
              Forecast Surge: +{activeBasin.forecastNext24hMm} mm next 24h
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)' }}>
            <Droplets size={24} />
          </div>
        </div>

        {/* Stat Card 3: River Discharge */}
        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">RIVER BASIN DISCHARGE</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>
              {(activeBasin.dischargeCusecs / 1000).toFixed(0)}k
            </div>
            <span className="stat-card-subtext">
              {activeBasin.dischargeCusecs.toLocaleString()} Cusecs Flow Rate
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-cyan)' }}>
            <Activity size={24} />
          </div>
        </div>

        {/* Stat Card 4: Peak Inundation Countdown */}
        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">PEAK INUNDATION WINDOW</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>
              {activeBasin.peakInundationEtaHours} hrs
            </div>
            <span className="stat-card-subtext" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
              Mandatory evacuation for low contours
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(217, 119, 6, 0.1)', color: 'var(--accent-amber)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

      </div>

      {/* 48-Hour Inundation Timeline Slider Card */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              48-Hour Timeline Progression
            </h2>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Select forecast hour to inspect water levels and flooded roads
            </span>
          </div>
          {getSeverityBadge(activeStep.severity)}
        </div>

        {/* Timeline Horizontal Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: 8,
          marginBottom: 14
        }}>
          {TIMELINE_FORECAST_STEPS.map((step, idx) => {
            const isSelected = idx === currentStepIndex;
            return (
              <button
                key={step.hourOffset}
                onClick={() => handleStepClick(idx)}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-tertiary)',
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '10px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? 'var(--accent-red)' : 'var(--text-primary)', marginTop: 2 }}>
                  +{step.waterRiseMeters}m
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {step.submergedRoadsCount} Submerged
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Details */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            {activeStep.timeDisplay}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {activeStep.summary}
          </p>
        </div>
      </div>

      {/* Sector Forecast Table / List */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>
          Sector-by-Sector Inundation ETAs
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SECTOR_FLOOD_PREDICTIONS.map((sec, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-tertiary)',
                padding: 14,
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {sec.sector}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Expected Water Depth: <b style={{ color: sec.submergenceDepth.includes('0') ? 'var(--accent-emerald)' : 'var(--accent-red)' }}>{sec.submergenceDepth}</b>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Breach Window: <b>{sec.breachTime}</b>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="tactical-badge" style={{
                  background: sec.riskLevel === 'CRITICAL' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(5, 150, 105, 0.15)',
                  color: sec.riskLevel === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-emerald)',
                  fontSize: 10
                }}>
                  {sec.status.replace('_', ' ')}
                </span>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', marginTop: 4 }}>
                  → {sec.recommendedHighGround}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
