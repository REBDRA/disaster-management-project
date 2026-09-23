import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Waves, 
  Activity, 
  Mountain, 
  Wind, 
  AlertTriangle, 
  Cpu, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Clock, 
  Radio, 
  ChevronRight,
  Zap,
  Droplets,
  Layers,
  Thermometer,
  Gauge
} from 'lucide-react';
import { 
  DISASTER_TYPES, 
  DISASTER_PRESETS, 
  fetchLiveAiDisasterDiagnosis 
} from '../utils/aiDisasterEngine';
import { playSound } from '../utils/audioEffects';

export default function AiDisasterIntelligence({ soundEnabled }) {
  const [selectedDisasterTypeId, setSelectedDisasterTypeId] = useState('MULTI_HAZARD');
  const [selectedPresetId, setSelectedPresetId] = useState('preset-wayanad');
  const [customLocation, setCustomLocation] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [activeTab, setActiveTab] = useState('PRESETS'); // 'PRESETS' | 'CUSTOM'

  // Selected preset object
  const activePreset = DISASTER_PRESETS.find(p => p.id === selectedPresetId) || DISASTER_PRESETS[0];

  // Set initial diagnosis from preset
  useEffect(() => {
    if (!currentDiagnosis) {
      setCurrentDiagnosis(activePreset);
    }
  }, [activePreset, currentDiagnosis]);

  const handleSelectPreset = (preset) => {
    if (soundEnabled) playSound('click');
    setSelectedPresetId(preset.id);
    setIsAnalyzing(true);
    setTimeout(() => {
      setCurrentDiagnosis(preset);
      setIsAnalyzing(false);
      if (soundEnabled) playSound('success');
    }, 300);
  };

  const handleRunCustomDiagnosis = async (e) => {
    if (e) e.preventDefault();
    if (!customLocation.trim()) return;

    if (soundEnabled) playSound('click');
    setIsAnalyzing(true);

    try {
      const result = await fetchLiveAiDisasterDiagnosis(
        customLocation.trim(),
        selectedDisasterTypeId === 'MULTI_HAZARD' ? 'FLOOD_INUNDATION' : selectedDisasterTypeId,
        customNotes
      );
      setCurrentDiagnosis(result);
      if (soundEnabled) playSound('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeHazard = currentDiagnosis || activePreset;
  const analysis = activeHazard.aiAnalysis || {};

  const getThreatBadge = (threat) => {
    switch (threat) {
      case 'SEVERE_EMERGENCY':
        return <span className="tactical-badge badge-red" style={{ animation: 'pulse-sos 1.5s infinite' }}>🚨 SEVERE EMERGENCY</span>;
      case 'CRITICAL':
        return <span className="tactical-badge badge-red">⚠️ CRITICAL THREAT</span>;
      case 'HIGH_ALERT':
        return <span className="tactical-badge badge-amber">⚡ HIGH ALERT</span>;
      default:
        return <span className="tactical-badge badge-cyan">ℹ️ ACTIVE SURVEILLANCE</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tactical-badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Cpu size={12} />
              AI NEURAL CORE
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>
              v3.4 Multi-Hazard Intelligence
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            AI Disaster Warning Center
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Predictive neural early warnings for Earthquakes, Landslides, Flash Floods, and Cyclones.
          </p>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              setActiveTab('PRESETS');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'PRESETS' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'PRESETS' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Live Hazard Scenarios
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              setActiveTab('CUSTOM');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'CUSTOM' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'CUSTOM' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Custom AI Diagnosis
          </button>
        </div>
      </div>

      {/* Hazard Category Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {DISASTER_TYPES.map(type => {
          const isSelected = selectedDisasterTypeId === type.id;
          return (
            <button
              key={type.id}
              onClick={() => {
                if (soundEnabled) playSound('click');
                setSelectedDisasterTypeId(type.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 12,
                border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 800 : 600,
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {type.id === 'FLOOD_INUNDATION' && <Waves size={14} />}
              {type.id === 'EARTHQUAKE_SEISMIC' && <Activity size={14} />}
              {type.id === 'LANDSLIDE_DEBRIS' && <Mountain size={14} />}
              {type.id === 'CYCLONE_STORM' && <Wind size={14} />}
              {type.id === 'MULTI_HAZARD' && <ShieldAlert size={14} />}
              <span>{type.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preset Scenario Cards Grid */}
      {activeTab === 'PRESETS' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 10
        }}>
          {DISASTER_PRESETS
            .filter(p => selectedDisasterTypeId === 'MULTI_HAZARD' || p.disasterType === selectedDisasterTypeId)
            .map(preset => {
              const isSelected = activeHazard.id === preset.id;
              const pAnalysis = preset.aiAnalysis || {};
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    background: isSelected ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                    border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: 14,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      📍 {preset.location}
                    </span>
                    {getThreatBadge(preset.threatLevel)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
                    {preset.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>Confidence: <b>{pAnalysis.confidenceScore || '96.4%'}</b></span>
                    <span>•</span>
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>Inspect AI →</span>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        /* Custom AI Disaster Diagnosis Query Box */
        <div className="glass-panel" style={{ padding: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
            Run AI Disaster Threat Assessment for Any City / District
          </h2>
          <form onSubmit={handleRunCustomDiagnosis} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Target Location / District
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wayanad, Joshimath, Guwahati, Mumbai, Shimla..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Hazard Domain
                </label>
                <select
                  value={selectedDisasterTypeId}
                  onChange={(e) => setSelectedDisasterTypeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="FLOOD_INUNDATION">Floods, Flash Floods & Dam Surge</option>
                  <option value="EARTHQUAKE_SEISMIC">Earthquakes & Fault Ruptures</option>
                  <option value="LANDSLIDE_DEBRIS">Landslides & Hill Slope Mudflow</option>
                  <option value="CYCLONE_STORM">Cyclones & Coastal Storm Surges</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Optional Sensor & Ground Observations
              </label>
              <input
                type="text"
                placeholder="e.g., Heavy 24h cloudburst, river water rising 15cm/hr, slope cracks visible..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !customLocation.trim()}
              className="action-pill-btn action-pill-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              <Sparkles size={16} />
              <span>{isAnalyzing ? 'AI Neural Model Synthesizing Telemetry...' : 'Synthesize AI Disaster Warning'}</span>
            </button>
          </form>
        </div>
      )}

      {/* AI Live Diagnostic Intelligence Panel */}
      <div className="glass-panel" style={{ padding: 20, border: '1.5px solid var(--accent-blue)' }}>
        
        {/* Panel Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Zap size={14} />
                AI NEURAL PREDICTION VERDICT
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Target: <b>{activeHazard.location || 'Active Region'}</b>
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              {activeHazard.title || `Disaster Warning: ${activeHazard.location}`}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>CONFIDENCE SCORE</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent-emerald)' }}>
                {analysis.confidenceScore || '96.4%'}
              </div>
            </div>
            {getThreatBadge(activeHazard.threatLevel)}
          </div>
        </div>

        {/* Dynamic Multi-Sensor Telemetry Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 10,
          marginBottom: 16
        }}>
          {activeHazard.sensorData && Object.entries(activeHazard.sensorData).map(([key, val]) => (
            <div key={key} style={{
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {key.replace(/([A-Z])/g, ' $1')}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* AI Diagnostic Summary */}
        <div style={{
          background: 'rgba(37, 99, 235, 0.06)',
          borderLeft: '4px solid var(--accent-blue)',
          padding: 14,
          borderRadius: '0 12px 12px 0',
          marginBottom: 16
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={14} />
            PHYSICAL MECHANISM & FORECAST SYNTHESIS
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            {analysis.summary}
          </p>
        </div>

        {/* Timeline & Evacuation Directives Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
          marginBottom: 16
        }}>
          {/* Timeline */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-amber)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} />
              PREDICTED IMPACT TIMELINE
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {analysis.predictedTimeline}
            </div>
          </div>

          {/* Evacuation Directive */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} />
              CIVIL DEFENSE & EVACUATION MANDATE
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {analysis.evacuationPriority}
            </div>
          </div>
        </div>

        {/* Key Risk Factors List */}
        {analysis.keyRisks && analysis.keyRisks.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
              Identified Compound Risk Vectors:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {analysis.keyRisks.map((risk, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-primary)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-red)' }} />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
