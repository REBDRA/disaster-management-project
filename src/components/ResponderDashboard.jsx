import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Radio, 
  Anchor, 
  Drone, 
  BatteryCharging
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';

export default function ResponderDashboard({ soundEnabled }) {
  const [sosQueue, setSosQueue] = useState([
    {
      id: 'SOS-091',
      sender: 'Citizen Unit #441 (0x882a...9b11)',
      triage: 'RED_CRITICAL',
      medicalNeed: 'Elderly on dialysis, floodwaters reached 1st floor staircase',
      coords: '26.179°N, 91.739°E (Elevation: 48.2m)',
      hops: 3,
      battery: '38%',
      status: 'PENDING_DISPATCH',
      assignedUnit: null
    },
    {
      id: 'SOS-092',
      sender: 'Citizen Unit #802 (0x33b1...881c)',
      triage: 'YELLOW_WARNING',
      medicalNeed: 'Compound fracture, clean water exhausted. 2 adults.',
      coords: '26.175°N, 91.751°E (Elevation: 50.1m)',
      hops: 2,
      battery: '64%',
      status: 'PENDING_DISPATCH',
      assignedUnit: null
    },
    {
      id: 'SOS-093',
      sender: 'Citizen Unit #109 (0x77c2...120f)',
      triage: 'GREEN_ADVISORY',
      medicalNeed: 'Requires guided safe walking corridor to Navagraha Ridge Camp',
      coords: '26.184°N, 91.758°E (Elevation: 53.0m)',
      hops: 1,
      battery: '82%',
      status: 'RESOLVED',
      assignedUnit: 'SDRF Foot Patrol 2'
    }
  ]);

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleDispatch = (id, unitType) => {
    if (soundEnabled) playSound('success');

    setSosQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'DISPATCHED_EN_ROUTE',
          assignedUnit: unitType
        };
      }
      return item;
    }));
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;

    if (soundEnabled) playSound('alert');
    setBroadcastSent(true);

    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 2500);
  };

  return (
    <div className="resq-responder-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 16 }}>
      
      {/* Live SOS Distress Triage Queue */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={20} color="#ff2a5f" />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                SDRF / NDRF TACTICAL RESCUE QUEUE
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              Cryptographically verified EIP-712 distress packets received via P2P mesh relay.
            </div>
          </div>

          <span className="tactical-badge badge-red">
            {sosQueue.filter(s => s.status !== 'RESOLVED').length} ACTIVE CASES
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sosQueue.map(item => {
            const isRed = item.triage === 'RED_CRITICAL';
            const isYellow = item.triage === 'YELLOW_WARNING';

            return (
              <div
                key={item.id}
                style={{
                  background: isRed ? 'rgba(255, 42, 95, 0.08)' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${isRed ? 'rgba(255, 42, 95, 0.4)' : 'var(--border-subtle)'}`,
                  borderRadius: 10,
                  padding: 16
                }}
              >
                <div className="resq-sos-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="code-pill" style={{ color: '#ffffff' }}>{item.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isRed ? '#ff4d79' : '#ffffff' }}>
                        {item.sender}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#f8fafc', marginTop: 6, fontWeight: 500 }}>
                      {item.medicalNeed}
                    </div>
                  </div>

                  <span className={`tactical-badge ${isRed ? 'badge-red' : isYellow ? 'badge-amber' : 'badge-emerald'}`}>
                    {item.triage.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color="var(--accent-cyan)" /> {item.coords}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Radio size={12} color="var(--accent-emerald)" /> {item.hops} Mesh Hops
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BatteryCharging size={12} /> Battery: {item.battery}
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 11 }}>
                    Status: <span style={{ color: item.status === 'DISPATCHED_EN_ROUTE' ? 'var(--accent-emerald)' : '#ff4d79', fontWeight: 600 }}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    {item.assignedUnit && <span style={{ color: '#ffffff' }}> ({item.assignedUnit})</span>}
                  </div>

                  {item.status === 'PENDING_DISPATCH' && (
                    <div className="resq-sos-item-actions" style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleDispatch(item.id, 'SDRF Inflatable Motorboat #4')}
                        className="btn-ghost"
                        style={{ padding: '6px 10px', fontSize: 11, color: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}
                      >
                        <Anchor size={13} />
                        Dispatch Boat
                      </button>
                      <button
                        onClick={() => handleDispatch(item.id, 'NDRF Medical Air Drone Unit')}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: 11 }}
                      >
                        <Drone size={13} />
                        Airdrop Drone
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Emergency Alert Over P2P Mesh */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div className="glass-panel-red" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Radio size={20} color="#ff2a5f" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>OFFICIAL P2P EVACUATION BROADCAST</span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.4 }}>
            Broadcasts a signed high-priority command alert across the civilian Bluetooth / Wi-Fi Direct gossip mesh. Displays immediately on all connected citizen devices.
          </div>

          <form onSubmit={handleSendBroadcast}>
            <textarea
              required
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. MANDATORY EVACUATION: Water surcharge has crossed 6.0m. Move immediately along Kamakhya Foothills to Nilachal Camp."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                background: '#070a12',
                border: '1px solid rgba(255, 42, 95, 0.4)',
                color: '#ffffff',
                marginBottom: 14,
                resize: 'none'
              }}
            />

            <button
              type="submit"
              disabled={broadcastSent}
              className="btn-sos"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Send size={16} />
              {broadcastSent ? '✓ BROADCAST DISSEMINATING ACROSS MESH' : 'BROADCAST EMERGENCY DIRECTIVE'}
            </button>
          </form>
        </div>

        {/* First Responder Protocol Details */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--accent-cyan)' }}>
            COMMAND INTEROPERABILITY
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • Dual-mode architecture enables SDRF & NDRF field units to act as local mobile Wi-Fi Direct hubs.<br/>
            • In-field tablet devices collect SOS hop proofs and cache them locally.<br/>
            • Automatic on-chain sync occurs when any rescue vehicle returns within range of Starlink / satellite command uplink.
          </div>
        </div>

      </div>

    </div>
  );
}
