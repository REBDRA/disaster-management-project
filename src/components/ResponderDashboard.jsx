import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Anchor, 
  CheckCircle2, 
  Users, 
  Activity 
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          NDRF / SDRF Triage Center
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          112 Incident triage, rescue boat fleet dispatch & citizen flash alerts
        </p>
      </div>

      {/* Responder Fleet Overview Metrics */}
      <div className="resq-stat-grid">
        
        <div className="resq-stat-card">
          <div className="resq-stat-card-left">
            <span className="resq-stat-label">HIGH PRIORITY SOS</span>
            <div className="resq-stat-value" style={{ color: 'var(--accent-red)' }}>
              {sosQueue.filter(s => s.status === 'PENDING_DISPATCH').length} Active
            </div>
            <span className="resq-stat-subtext">Immediate extraction</span>
          </div>
          <div className="resq-stat-icon-box" style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-red)' }}>
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="resq-stat-card">
          <div className="resq-stat-card-left">
            <span className="resq-stat-label">RESCUE BOATS ACTIVE</span>
            <div className="resq-stat-value" style={{ color: 'var(--accent-blue)' }}>
              8 Units
            </div>
            <span className="resq-stat-subtext">Brahmaputra Basin</span>
          </div>
          <div className="resq-stat-icon-box" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)' }}>
            <Anchor size={20} />
          </div>
        </div>

        <div className="resq-stat-card">
          <div className="resq-stat-card-left">
            <span className="resq-stat-label">EVACUEES SHELTERED</span>
            <div className="resq-stat-value" style={{ color: 'var(--accent-emerald)' }}>
              1,370
            </div>
            <span className="resq-stat-subtext">Across 3 Camps</span>
          </div>
          <div className="resq-stat-icon-box" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--accent-emerald)' }}>
            <Users size={20} />
          </div>
        </div>

      </div>

      {/* SOS Queue & Dispatch Actions */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>
          Live Citizen SOS Dispatch Queue
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sosQueue.map(item => {
            const isCritical = item.triage === 'RED_CRITICAL';
            return (
              <div
                key={item.id}
                className="resq-card-panel"
                style={{
                  border: isCritical ? '1px solid rgba(225, 29, 72, 0.35)' : '1px solid var(--border-subtle)',
                  padding: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>{item.id}</span>
                    {isCritical ? (
                      <span className="tactical-badge badge-red" style={{ fontSize: 8 }}>CRITICAL</span>
                    ) : (
                      <span className="tactical-badge badge-amber" style={{ fontSize: 8 }}>WARNING</span>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{item.sender.split(' ')[0]}</span>
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0' }}>
                  {item.medicalNeed}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    📍 {item.coords.split('(')[0]}
                  </div>

                  <div>
                    {item.status === 'PENDING_DISPATCH' ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => handleDispatch(item.id, 'NDRF Boat #3')}
                          className="resq-action-btn resq-action-primary"
                          style={{ padding: '4px 8px', fontSize: 10, minHeight: 'unset' }}
                        >
                          <Anchor size={11} />
                          <span>Dispatch Boat</span>
                        </button>
                      </div>
                    ) : (
                      <span className="tactical-badge badge-emerald" style={{ fontSize: 8 }}>
                        <CheckCircle2 size={10} /> {item.assignedUnit || 'EN ROUTE'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mass Civil Defense Broadcast */}
      <div className="resq-card-panel">
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
          Emergency Radio & Push Broadcast
        </div>

        {broadcastSent && (
          <div style={{
            background: 'rgba(5, 150, 105, 0.12)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            padding: 8,
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 8
          }}>
            ✓ Emergency Alert transmitted to local mesh nodes and SMS gateway.
          </div>
        )}

        <form onSubmit={handleBroadcast} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="e.g. Flash Warning: Evacuate Zone A immediately."
            style={{
              flex: 1,
              minWidth: 180,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: 12
            }}
          />
          <button type="submit" className="resq-action-btn resq-action-primary" style={{ width: 'auto' }}>
            <Send size={12} />
            <span>Transmit</span>
          </button>
        </form>
      </div>

    </div>
  );
}
