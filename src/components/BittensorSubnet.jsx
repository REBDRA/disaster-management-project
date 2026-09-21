import React, { useState } from 'react';
import { 
  Brain, 
  Award, 
  Zap, 
  Download, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BITTENSOR_MINERS } from '../utils/bittensorMock';
import { playSound } from '../utils/audioEffects';

export default function BittensorSubnet({ soundEnabled }) {
  const [miners] = useState(BITTENSOR_MINERS);
  const [selectedMiner, setSelectedMiner] = useState(BITTENSOR_MINERS[0]);
  const [isDistilling, setIsDistilling] = useState(false);
  const [distilledDownloaded, setDistilledDownloaded] = useState(false);

  const handleExportDistilledModel = () => {
    setIsDistilling(true);
    if (soundEnabled) playSound('click');

    setTimeout(() => {
      setIsDistilling(false);
      setDistilledDownloaded(true);
      if (soundEnabled) playSound('success');

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="resq-bittensor-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
      
      {/* Left Column: Subnet Swarm & Yuma Consensus */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Header Panel */}
        <div className="glass-panel" style={{ padding: 22, border: '1px solid var(--border-cyan)' }}>
          <div className="resq-bittensor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
              }}>
                <Brain size={24} color="#070a12" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>BITTENSOR SUBNET 42</span>
                  <span className="tactical-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                    τ TAO EMISSIONS ACTIVE
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Decentralized Intelligence Market for Flood Inundation Prediction, SAR Vision & Evacuation Optimization
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>SUBNET EMISSION RATE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-cyan)' }}>
                1.42 τ / block
              </div>
            </div>
          </div>

          {/* Subnet Statistics Cards */}
          <div className="resq-bittensor-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ACTIVE MINERS</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>128 Nodes</div>
              <div style={{ fontSize: 10, color: 'var(--accent-emerald)', marginTop: 2 }}>Global Hydrology ML</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>VALIDATOR STAKE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>42,500 τ</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>Yuma Consensus v2</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>PREDICTION LATENCY</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-cyan)', marginTop: 4 }}>420 ms</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>99.2% Subnet Uptime</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>DISTILLED ONNX</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-emerald)', marginTop: 4 }}>8.4 MB</div>
              <div style={{ fontSize: 10, color: 'var(--accent-cyan)', marginTop: 2 }}>Offline On-Device Ready</div>
            </div>
          </div>
        </div>

        {/* Live Miners Ranking Table */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                YUMA CONSENSUS LEADERBOARD (MINER MODELS)
              </span>
            </div>
            <span className="code-pill">VAL SCORE EVALUATION: 100% DECENTRALIZED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {miners.map((m) => {
              const isSelected = selectedMiner.uid === m.uid;

              return (
                <div
                  key={m.uid}
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    setSelectedMiner(m);
                  }}
                  style={{
                    background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(0,0,0,0.25)',
                    border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    borderRadius: 10,
                    padding: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div className="resq-miner-row-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="resq-miner-meta" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="code-pill" style={{ background: '#000', color: 'var(--accent-cyan)' }}>
                        UID #{m.uid}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                        {m.specialty}
                      </span>
                      <span className="code-pill" style={{ color: 'var(--text-muted)' }}>
                        Hotkey: {m.hotkey}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#c084fc' }}>
                          {m.incentive}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                          Trust: {(m.trust * 100).toFixed(0)}% • Loss: {m.loss}
                        </div>
                      </div>
                      <span className={`tactical-badge ${m.status === 'TOP_PERFORMER' ? 'badge-emerald' : 'badge-cyan'}`} style={{ fontSize: 9 }}>
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: 6 }}>
                    💬 <b>Live Inference:</b> {m.prediction}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Column: Model Distillation & Why Bittensor Is Worth It */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Distill for Offline Use Card */}
        <div className="glass-panel-cyan" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>DISTILL TO MOBILE EDGE</span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
            Bittensor miners compete to produce state-of-the-art weights. RESQ continuously distills the top-scoring consensus models into a lightweight <b>8.4 MB ONNX neural engine</b> that runs directly on citizen smartphones with zero internet or cloud compute.
          </div>

          <div style={{ background: '#05070d', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 16, fontSize: 11 }}>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: 4 }}>// Active Distillation Pipeline</div>
            <div style={{ color: '#94a3b8' }}>Source: Subnet 42 Consensus Swarm</div>
            <div style={{ color: '#94a3b8' }}>Quantization: INT8 TensorRT / ONNX</div>
            <div style={{ color: 'var(--accent-emerald)', marginTop: 4 }}>✓ Memory: 32MB RAM • Execution: On-Device CPU</div>
          </div>

          <button
            onClick={handleExportDistilledModel}
            disabled={isDistilling}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}
          >
            <Download size={16} />
            {isDistilling ? 'Distilling Consensus Weights...' : distilledDownloaded ? '✓ Weights Synced to Flash Storage' : 'Distill Model for Offline Routing'}
          </button>
        </div>

        {/* Why Bittensor Architecture Wins */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Award size={16} color="var(--accent-amber)" />
            <span>WHY BITTENSOR IS WORTH IT</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
              <b style={{ color: '#ffffff' }}>1. Continuous AI Competition</b><br/>
              Centralized APIs (NOAA, commercial maps) update slowly. Bittensor incentivizes hundreds of global ML teams with $TAO to specialize in hyper-local flood prediction.
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
              <b style={{ color: '#ffffff' }}>2. Resilience to Blackouts</b><br/>
              Cloud AI fails when cell towers go down. By distilling the collective Bittensor intelligence into offline edge weights, fleeing citizens retain the world's best routing models without cellular connectivity.
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
              <b style={{ color: '#ffffff' }}>3. Cryptographic Incentive Alignment</b><br/>
              Miners are rewarded in $TAO based purely on empirical accuracy verified against actual flood sensor feeds, eliminating bias.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
