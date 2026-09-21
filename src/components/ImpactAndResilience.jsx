import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Leaf, 
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';

export default function ImpactAndResilience({ soundEnabled }) {
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  const cycleSteps = [
    {
      step: '1. Hazard Detection',
      actor: 'Automated Hub & Beacon Sensors',
      desc: 'Ground sensors and satellite radar detect critical flood conditions, rising water levels, and embankment cracks.',
      status: 'AUTOMATED'
    },
    {
      step: '1.5 Data Transmission',
      actor: 'Device-to-Device Signal Mesh',
      desc: 'Hazard telemetry hops through citizen smartphones and solar repeaters using Bluetooth/Wi-Fi Direct without cell towers.',
      status: 'MESH RELAY'
    },
    {
      step: '2. Alert Validation & Communication',
      actor: 'Community Consensus',
      desc: 'Local Byzantine fault-tolerant voting confirms the road blockage, preventing fake panic or misinformation.',
      status: 'VERIFIED'
    },
    {
      step: '3. Users Receive SOS & Route',
      actor: 'Vulnerable Community Members',
      desc: 'Fleeing citizens receive accessible alerts and a one-tap SOS option, while elevation A* guides them to high ground.',
      status: 'OFFLINE ROUTE'
    },
    {
      step: '4. Resource Allocation & Dispatch',
      actor: 'SDRF / NDRF Command',
      desc: 'Prioritized triage queues disburse rescue boats and medical airdrops to the most vulnerable victims first.',
      status: 'DISPATCHED'
    },
    {
      step: '5. Coordinated Management',
      actor: 'Citywide Flow Coordination',
      desc: 'Multi-modal traffic load balancing steers vehicles away from submerged chokepoints, eliminating gridlock.',
      status: 'SAFE HIGH GROUND'
    }
  ];

  const impactMetrics = [
    { label: 'POPULATION REACHABLE WITHOUT NETWORK', value: 100, color: 'var(--accent-cyan)', note: 'Zero-cellular P2P mesh coverage' },
    { label: 'SOS DELIVERY SUCCESS RATE', value: 89, color: 'var(--accent-emerald)', note: 'Store-and-forward packet guarantee' },
    { label: 'EST. REDUCTION IN EVACUATION TIME', value: 54, color: '#a855f7', note: 'Avoidance of submerged bottlenecks' },
    { label: 'EST. REDUCTION IN ROUTE CONGESTION', value: 47, color: 'var(--accent-amber)', note: 'Dynamic elevation load balancing' }
  ];

  const economicData = [
    { year: 'Year 1', capex: 7.0, opex: 9.5, returnVal: 15.0 },
    { year: 'Year 2', capex: 4.5, opex: 7.5, returnVal: 18.5 },
    { year: 'Year 3', capex: 12.5, opex: 23.0, returnVal: 32.0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner: The Ultimate Resilience Cycle */}
      <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={22} color="var(--accent-cyan)" />
              <span>THE ULTIMATE RESILIENCE CYCLE (END-TO-END WORKFLOW)</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              How ResQ coordinates early hazard detection, P2P mesh alerts, civilian evacuation, and NDRF dispatch.
            </div>
          </div>
          <span className="tactical-badge badge-cyan">
            DUAL-ENGINE RESILIENCE
          </span>
        </div>

        {/* Stepper Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
          {cycleSteps.map((item, idx) => {
            const isActive = activeCycleStep === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setActiveCycleStep(idx);
                }}
                style={{
                  background: isActive ? 'rgba(0, 242, 254, 0.15)' : 'rgba(0,0,0,0.35)',
                  border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  borderRadius: 8,
                  padding: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: 10, color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 700 }}>
                  STEP {idx + 1}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', marginTop: 4, lineHeight: 1.2 }}>
                  {item.step.split('. ')[1] || item.step}
                </div>
                <span className={`tactical-badge ${isActive ? 'badge-emerald' : 'badge-cyan'}`} style={{ fontSize: 8, marginTop: 8, padding: '2px 6px' }}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Step Detail Card */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 16, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {cycleSteps[activeCycleStep].step} — {cycleSteps[activeCycleStep].actor}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              {cycleSteps[activeCycleStep].desc}
            </div>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              setActiveCycleStep(s => (s + 1) % cycleSteps.length);
            }}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            Next Step <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Middle Grid: Estimated Impact vs Feasibility & Viability */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        
        {/* Estimated Impact Simulated Metrics (From Slide 5) */}
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={18} color="var(--accent-emerald)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>ESTIMATED IMPACT (SIMULATED DATA)</span>
            </div>
            <span className="code-pill">SLIDE 5 VALIDATED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {impactMetrics.map((metric, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{metric.label}</span>
                  <span style={{ fontWeight: 800, color: metric.color }}>{metric.value}%</span>
                </div>

                <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{
                    width: `${metric.value}%`,
                    height: '100%',
                    background: metric.color,
                    borderRadius: 5,
                    transition: 'width 1s ease'
                  }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                  {metric.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Feasibility & Economic Viability (From Slide 4) */}
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>FEASIBILITY & ECONOMIC VIABILITY</span>
            </div>
            <span className="code-pill">ZERO HARDWARE CAPEX</span>
          </div>

          {/* Technical Feasibility Radar & Architecture */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 14 }}>
            {/* SVG Radar Polygon */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                {/* Background Web Polygons */}
                <polygon points="60,15 102,45 86,96 34,96 18,45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <polygon points="60,30 88,50 77,84 43,84 32,50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {/* Data Polygon */}
                <polygon points="60,20 98,48 82,90 38,88 24,48" fill="rgba(0, 242, 254, 0.25)" stroke="var(--accent-cyan)" strokeWidth="2" />
                {/* Radar Axis Points */}
                <circle cx="60" cy="20" r="3" fill="var(--accent-cyan)" />
                <circle cx="98" cy="48" r="3" fill="var(--accent-cyan)" />
                <circle cx="82" cy="90" r="3" fill="var(--accent-cyan)" />
                <circle cx="38" cy="88" r="3" fill="var(--accent-cyan)" />
                <circle cx="24" cy="48" r="3" fill="var(--accent-cyan)" />
                {/* Labels */}
                <text x="60" y="12" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">LATENCY</text>
                <text x="106" y="50" textAnchor="start" fill="#94a3b8" fontSize="7" fontWeight="bold">SCALE</text>
                <text x="86" y="106" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">AI ACCURACY</text>
                <text x="34" y="106" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">SECURITY</text>
                <text x="14" y="50" textAnchor="end" fill="#94a3b8" fontSize="7" fontWeight="bold">MAINT</text>
              </svg>
              <span style={{ fontSize: 9, color: 'var(--accent-cyan)', fontWeight: 700, marginTop: 4 }}>TECHNICAL RADAR</span>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: 4 }}>TECHNICAL FEASIBILITY (SLIDE 4)</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                • <b>Open-Source Core:</b> Leaflet, FastAPI, SRTM DEM, A* routing.<br/>
                • <b>Modular Microservices:</b> Edge-first resilient nodes.<br/>
                • <b>Dual-Engine:</b> Instant failover from cloud to on-device.
              </div>
            </div>
          </div>

          {/* Offline Resilience Flow: Network Fail -> Mesh P2P -> Continuous Routing */}
          <div style={{ background: 'rgba(255, 42, 95, 0.08)', border: '1px solid rgba(255, 42, 95, 0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ff4d79', letterSpacing: 0.5, marginBottom: 6 }}>
              OFFLINE RESILIENCE PIPELINE (SLIDE 4)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: 6, flex: 1, border: '1px solid rgba(255, 42, 95, 0.4)' }}>
                <div style={{ fontSize: 9, color: '#ff4d79', fontWeight: 800 }}>1. NETWORK FAIL</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>Towers collapse</div>
              </div>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 800, fontSize: 14 }}>➔</div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: 6, flex: 1, border: '1px solid rgba(0, 242, 254, 0.4)' }}>
                <div style={{ fontSize: 9, color: 'var(--accent-cyan)', fontWeight: 800 }}>2. MESH P2P</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>BLE / Wi-Fi Direct</div>
              </div>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 800, fontSize: 14 }}>➔</div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: 6, flex: 1, border: '1px solid rgba(0, 245, 155, 0.4)' }}>
                <div style={{ fontSize: 9, color: 'var(--accent-emerald)', fontWeight: 800 }}>3. CONTINUOUS ROUTING</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>On-device safe path</div>
              </div>
            </div>
          </div>

          {/* Projected Deployment Value (From Slide 4 Chart) */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>
                PROJECTED DEPLOYMENT VALUE (SLIDE 4 SIMULATED DATA)
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                Target: SDRF, NDRF, Assam, Bihar, West Bengal
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
              {economicData.map((d, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{d.year}</div>
                  
                  {/* Visual Mini Bars */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 46, margin: '8px 0 6px 0' }}>
                    <div title={`Initial Capex: ${d.capex}`} style={{ width: 14, height: `${(d.capex / 35) * 100}%`, background: '#eab308', borderRadius: '2px 2px 0 0' }} />
                    <div title={`Annual Opex: ${d.opex}`} style={{ width: 14, height: `${(d.opex / 35) * 100}%`, background: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                    <div title={`Projected Return: ${d.returnVal}`} style={{ width: 14, height: `${(d.returnVal / 35) * 100}%`, background: '#10b981', borderRadius: '2px 2px 0 0' }} />
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    +{d.returnVal}x Return
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Capex: {d.capex} | Opex: {d.opex}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10, fontSize: 9, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#eab308', borderRadius: 2 }}></span> INITIAL CAPEX</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: 2 }}></span> ANNUAL OPEX</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#10b981', borderRadius: 2 }}></span> PROJECTED RETURN</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Triple Cards: Social, Economic, Environmental Benefits (From Slide 5) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        
        <div style={{ background: 'rgba(255, 42, 95, 0.08)', border: '1px solid rgba(255, 42, 95, 0.3)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ff4d79', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            <Users size={18} />
            <span>SOCIAL BENEFIT</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Protects the golden hour for at-risk groups (elderly, infants, hospitalized); equitable access regardless of literacy, income, or device capability via one-tap SOS.
          </div>
        </div>

        <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--border-cyan)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            <DollarSign size={18} />
            <span>ECONOMIC BENEFIT</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Earlier, verified warnings prevent catastrophic vehicle and property losses; smoother evacuation limits regional business shutdown and prevents bridge destruction.
          </div>
        </div>

        <div style={{ background: 'rgba(0, 245, 155, 0.08)', border: '1px solid rgba(0, 245, 155, 0.3)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-emerald)', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            <Leaf size={18} />
            <span>ENVIRONMENTAL BENEFIT</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            On-device routing cuts continuous cloud calls; dynamic high-ground load balancing drastically reduces vehicle idling fuel burn and greenhouse emissions from gridlock.
          </div>
        </div>

      </div>

    </div>
  );
}
