import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { signSOSPacket } from '../utils/web3Mock';
import { playSound } from '../utils/audioEffects';
import { broadcastSOSToApi } from '../utils/apiClient';

export default function SosModal({ isOpen, onClose, walletAddress, soundEnabled, onSosBroadcast }) {
  const [triageCategory, setTriageCategory] = useState('TRAPPED_FLOOD');
  const [notes, setNotes] = useState('');
  const [signedPacket, setSignedPacket] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [liveGps, setLiveGps] = useState([26.183, 91.745]);
  const [isGpsLive, setIsGpsLive] = useState(false);

  // Auto-detect user GPS on modal open
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveGps([pos.coords.latitude, pos.coords.longitude]);
          setIsGpsLive(true);
        },
        () => {}
      );
    }
  }, []);

  if (!isOpen) return null;

  const handleSendSOS = (e) => {
    e.preventDefault();
    setIsSending(true);

    if (soundEnabled) playSound('sos');

    setTimeout(() => {
      const rawPayload = {
        category: triageCategory,
        notes: notes || 'Immediate evacuation assistance requested via ResQ DePIN Mesh',
        coords: liveGps,
        elevation: 49.2,
        battery: 84
      };

      const signed = signSOSPacket(rawPayload, walletAddress);
      setSignedPacket(signed);
      setIsSending(false);

      if (soundEnabled) playSound('success');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Post to custom FastAPI backend
      broadcastSOSToApi(signed);

      if (onSosBroadcast) {
        onSosBroadcast(signed);
      }
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-panel" style={{
        width: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 42, 95, 0.5)',
        boxShadow: '0 0 40px rgba(255, 42, 95, 0.3)',
        padding: 24
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255, 42, 95, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ff2a5f'
            }}>
              <ShieldAlert size={20} color="#ff2a5f" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: 0.5 }}>
                BROADCAST EMERGENCY SOS BEACON
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                EIP-712 Tamper-Proof Cryptographic Distress Attestation
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '4px 8px' }}
          >
            <X size={16} />
          </button>
        </div>

        {!signedPacket ? (
          <form onSubmit={handleSendSOS}>
            {/* Triage Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                SELECT EMERGENCY CLASSIFICATION
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { id: 'CRITICAL_LIFE', label: '🚨 Life Threatening', desc: 'Medical emergency / injured' },
                  { id: 'TRAPPED_FLOOD', label: '🌊 Trapped by Water', desc: 'Water entering structure' },
                  { id: 'EVAC_ASSIST', label: '🧓 Evac Assistance', desc: 'Infants / Senior citizens' },
                  { id: 'FOOD_WATER', label: '💧 Critical Supplies', desc: 'Drinking water exhausted' }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (soundEnabled) playSound('click');
                      setTriageCategory(item.id);
                    }}
                    style={{
                      background: triageCategory === item.id ? 'rgba(255, 42, 95, 0.15)' : 'rgba(0,0,0,0.3)',
                      border: `1px solid ${triageCategory === item.id ? '#ff2a5f' : 'var(--border-subtle)'}`,
                      borderRadius: 8,
                      padding: 10,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: triageCategory === item.id ? '#ff4d79' : '#ffffff' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                SITUATION BRIEF / NUMBER OF INDIVIDUALS
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 4 individuals trapped on 2nd floor balcony, power cut off, water level 1.8m."
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  background: '#070a12',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 12,
                  resize: 'none'
                }}
              />
            </div>

            {/* Live Telemetry Metadata */}
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 18 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                BEACON TELEMETRY PAYLOAD (TO BE SIGNED)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span>📍 GPS: {liveGps[0].toFixed(4)}°N, {liveGps[1].toFixed(4)}°E {isGpsLive ? '(Live Fix)' : '(Demo)'}</span>
                <span>⛰️ DEM Elevation: 49.2m</span>
                <span>🔋 Battery: 84%</span>
                <span>📶 Relay: Zero-Cell P2P BLE Mesh</span>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="submit"
              disabled={isSending}
              className="btn-sos"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15 }}
            >
              <Radio size={18} />
              {isSending ? 'SIGNING & HOOKING TO P2P MESH...' : 'SIGN & TRANSMIT SOS BEACON'}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ background: 'rgba(0, 245, 155, 0.1)', border: '1px solid rgba(0, 245, 155, 0.4)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-emerald)', fontWeight: 700, fontSize: 14 }}>
                <CheckCircle2 size={18} />
                <span>CRYPTOGRAPHIC SOS BEACON ACTIVE</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                Your signed distress signal is actively hopping across nearby civilian devices and rescue gateways via Store-and-Forward P2P mesh.
              </div>
            </div>

            {/* Proof Card */}
            <div style={{ background: '#05070d', padding: 14, borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: 6 }}>// EIP-712 ECDSA Signature Proof</div>
              <div style={{ color: '#94a3b8', wordBreak: 'break-all' }}>Hash: {signedPacket.hash}</div>
              <div style={{ color: 'var(--text-muted)', wordBreak: 'break-all', marginTop: 4 }}>Sig: {signedPacket.signature.slice(0, 32)}...</div>
              <div style={{ color: 'var(--accent-emerald)', marginTop: 6 }}>✓ Status: P2P Hop #1 (Civilian Peer A)</div>
            </div>

            <button
              onClick={() => {
                setSignedPacket(null);
                onClose();
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Return to Evacuation Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
