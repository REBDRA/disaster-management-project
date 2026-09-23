import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Leaf, 
  ArrowRight,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';

export default function ImpactAndResilience({ soundEnabled }) {
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  const cycleSteps = [
    {
      step: '1. Hazard Detection',
      actor: 'Ground & CWC Sensors',
      desc: 'Ground water gauges and rainfall radar detect rising water levels and embankment stress.',
      status: 'AUTOMATED'
    },
    {
      step: '2. Radio Mesh Relay',
      actor: 'Device-to-Device Mesh',
      desc: 'Distress packets hop through civilian smartphones and repeaters using Bluetooth/LoRa without cell towers.',
      status: 'MESH RELAY'
    },
    {
      step: '3. Hazard Consensus',
      actor: 'Community & First Responders',
      desc: 'Multiple verified citizen reports confirm road blockages, preventing panic and misinformation.',
      status: 'VERIFIED'
    },
    {
      step: '4. Safe Evacuation',
      actor: 'Citizen Evacuation',
      desc: 'On-device SRTM 30m elevation routing steers fleeing citizens to high-ground sanctuaries.',
      status: 'OFFLINE ROUTE'
    },
    {
      step: '5. Resource Dispatch',
      actor: 'NDRF / SDRF Command',
      desc: 'Prioritized triage queues disburse rescue boats and medical kits to trapped citizens.',
      status: 'DISPATCHED'
    }
  ];

  const impactMetrics = [
    { label: 'POPULATION REACHABLE OFFLINE', value: '100%', note: 'Zero-cellular P2P mesh' },
    { label: 'SOS DELIVERY SUCCESS RATE', value: '89%', note: 'Store-and-forward buffer' },
    { label: 'EST. EVACUATION TIME REDUCTION', value: '54%', note: 'Submerged bottleneck bypass' },
    { label: 'ROUTE CONGESTION REDUCTION', value: '47%', note: 'Dynamic elevation balancing' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Resilience Cycle & Impact
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          Civic disaster mitigation workflow & quantifiable resilience benchmarks
        </p>
      </div>

      {/* Resilience Metrics Stack */}
      <div className="resq-stat-grid">
        {impactMetrics.map((m, idx) => (
          <div key={idx} className="resq-stat-card">
            <div className="resq-stat-card-left">
              <span className="resq-stat-label">{m.label}</span>
              <div className="resq-stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {m.value}
              </div>
              <span className="resq-stat-subtext">{m.note}</span>
            </div>
            <div className="resq-stat-icon-box">
              <TrendingUp size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* The 5-Step Resilience Workflow */}
      <div className="resq-card-panel">
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
          The End-to-End Resilience Workflow
        </div>

        {/* Step buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 4, marginBottom: 10 }}>
          {cycleSteps.map((item, idx) => {
            const isActive = activeCycleStep === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setActiveCycleStep(idx);
                }}
                className="resq-timeline-step-btn"
                style={{
                  background: isActive ? 'rgba(2, 132, 199, 0.18)' : 'var(--bg-tertiary)',
                  border: isActive ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  padding: '6px'
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {item.step}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Details */}
        <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
              {cycleSteps[activeCycleStep].step}
            </span>
            <span className="tactical-badge badge-cyan" style={{ fontSize: 8 }}>
              {cycleSteps[activeCycleStep].status}
            </span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 2 }}>
            Actor: {cycleSteps[activeCycleStep].actor}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {cycleSteps[activeCycleStep].desc}
          </p>
        </div>
      </div>

    </div>
  );
}
