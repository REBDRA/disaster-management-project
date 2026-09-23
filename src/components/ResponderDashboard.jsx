import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Radio, 
  Anchor, 
  BatteryCharging,
  CheckCircle2,
  Users,
  Activity,
  PhoneCall
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';

export default function ResponderDashboard({ soundEnabled }) {
  const [sosQueue, setSosQueue] = useState([
    {
      id: 'SOS-091',
      sender: 'Citizen Ward #441 (+91-98401-22910)',
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
      sender: 'Citizen Ward #802 (+91-97210-44182)',
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
      sender: 'Citizen Ward #109 (+91-99882-31094)',
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

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;

    if (soundEnabled) playSound('alert');
    setBroadcastSent(true);

    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-red), #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <ShieldAlert size={20} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              NDRF / SDRF Incident Triage & Rescue Dispatch
            </h1>
            <span className="tactical-badge badge-red">
              112 EMERGENCY OPERATIONS
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Real-time incident dispatch, rescue boat allocation, and civil defense mass broadcast console.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div className="code-pill" style={{ color: 'var(--accent-emerald)' }}>
            <Activity size={12} /> 12 RESCUE BOATS ACTIVE
          </div>
        </div>
      </div>

      {/* Responder Fleet Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        
        <div className="glass-panel" style={{ padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>PENDING HIGH-PRIORITY SOS</span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-red)', marginTop: 4 }}>
            {sosQueue.filter(s => s.status === 'PENDING_DISPATCH').length} Active
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Immediate extraction needed</span>
        </div>

        <div className="glass-panel" style={{ padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>RESCUE BOATS DEPLOYED</span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)', marginTop: 4 }}>
            8 Units
          </div>
          <span style={{ fontSize: 11, color: 'var(--accent-emerald)' }}>Brahmaputra & Bharalu Basin</span>
        </div>

        <div className="glass-panel" style={{ padding: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>EVACUEES SHELTERED TODAY</span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 4 }}>
            1,370 Citizens
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Across 3 High-Ground Camps</span>
        </div>

      </div>

      {/* SOS Queue & Dispatch Actions */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>
          Live Citizen SOS Dispatch Queue
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sosQueue.map(item => {
            const isCritical = item.triage === 'RED_CRITICAL';
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: isCritical ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14
                }}
              >
                <div style={{ maxWidth: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{item.id}</span>
                    {isCritical ? (
                      <span className="tactical-badge badge-red">CRITICAL RESCUE</span>
                    ) : (
                      <span className="tactical-badge badge-amber">WARNING</span>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.sender}</span>
                  </div>

                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0' }}>
                    {item.medicalNeed}
                  </p>

                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} color="var(--accent-cyan)" /> {item.coords}
                    </span>
                    <span>Battery: {item.battery}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  {item.status === 'PENDING_DISPATCH' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleDispatch(item.id, 'NDRF Motorized Boat #03')}
                        className="btn-primary"
                        style={{ padding: '8px 12px', fontSize: 11 }}
                      >
                        <Anchor size={13} />
                        <span>Dispatch Boat</span>
                      </button>
                      <button
                        onClick={() => handleDispatch(item.id, 'SDRF Quick Team')}
                        className="btn-ghost"
                        style={{ padding: '8px 12px', fontSize: 11 }}
                      >
                        <span>Dispatch Foot Unit</span>
                      </button>
                    </div>
                  ) : (
                    <div className="tactical-badge badge-emerald">
                      <CheckCircle2 size={12} /> {item.assignedUnit || 'EN ROUTE'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mass Civil Defense Broadcast */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
          Emergency Radio & Citizen Push Broadcast
        </h2>

        {broadcastSent && (
          <div style={{
            background: 'rgba(5, 150, 105, 0.12)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            padding: 10,
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 12
          }}>
            ✓ Emergency Flash Alert successfully transmitted to all local mesh nodes and SMS relays.
          </div>
        )}

        <form onSubmit={handleBroadcast} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="e.g. FLASH WARNING: Brahmaputra expected to rise +1.4m by 18:00 IST. Evacuate Zone A immediately."
            style={{
              flex: 1,
              minWidth: 280,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13
            }}
          />
          <button type="submit" className="btn-primary">
            <Send size={14} />
            <span>Transmit Flash Alert</span>
          </button>
        </form>
      </div>

    </div>
  );
}
