import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  Database, 
  Activity, 
  Wifi,
  Sparkles
} from 'lucide-react';
import { INITIAL_MESH_NODES, MESH_CONNECTIONS, STORE_AND_FORWARD_BUFFER } from '../utils/meshEngine';
import { playSound } from '../utils/audioEffects';

export default function MeshSimulator({ isBlackoutMode, soundEnabled }) {
  const [nodes, setNodes] = useState(INITIAL_MESH_NODES);
  const [buffer, setBuffer] = useState(STORE_AND_FORWARD_BUFFER);
  const [isHopping, setIsHopping] = useState(false);
  const [logs, setLogs] = useState([
    '🟢 BLE 5.3 & LoRa mesh active. 6 local radio nodes linked.',
    '📶 Store-and-Forward packet routing ready on 868MHz.',
    '⚡ Multi-hop relay active across citizen & drone hubs.'
  ]);

  const simulatePacketHop = () => {
    if (isHopping) return;
    setIsHopping(true);

    const hopSequence = [
      { step: 0, from: 'node-user', to: 'node-peer-1', text: 'Citizen Mobile -> Civilian Peer A (BLE 5.3)' },
      { step: 1, from: 'node-peer-1', to: 'node-beacon', text: 'Civilian Peer A -> Solar LoRa Repeater #12 (868MHz)' },
      { step: 2, from: 'node-beacon', to: 'node-drone', text: 'Solar LoRa Repeater -> SDRF Drone Delta-1 (Long Range RF)' },
      { step: 3, from: 'node-drone', to: 'node-gateway', text: 'Drone Delta-1 -> NDRF Base Command (Satellite WAN)' }
    ];

    let current = 0;

    const interval = setInterval(() => {
      if (current < hopSequence.length) {
        const item = hopSequence[current];
        if (soundEnabled) playSound('hop');

        setLogs(prev => [
          `📦 Hop #${item.step + 1}: ${item.text}`,
          ...prev.slice(0, 5)
        ]);

        setNodes(prevNodes => prevNodes.map(n => {
          if (n.id === item.from || n.id === item.to) {
            return {
              ...n,
              relayedCount: n.relayedCount + 1
            };
          }
          return n;
        }));

        current++;
      } else {
        clearInterval(interval);
        setIsHopping(false);
        if (soundEnabled) playSound('success');

        const newPacket = {
          packetId: `PKT-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
          senderId: 'NODE-CITIZEN-042',
          triageLevel: 'RED_CRITICAL',
          message: 'Zero-cellular SOS successfully delivered to NDRF HQ via 4 multi-hop radio relays.',
          hops: 4,
          status: 'DELIVERED_TO_HQ'
        };
        setBuffer(prev => [newPacket, ...prev]);
      }
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Radio Mesh Relay
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          LoRa 868MHz & BLE 5.3 ad-hoc store-and-forward packet forwarding when cellular grids fail
        </p>
      </div>

      <button
        onClick={simulatePacketHop}
        disabled={isHopping}
        className="resq-action-btn resq-action-primary"
      >
        <Send size={14} />
        <span>{isHopping ? 'Forwarding Multi-Hop Radio Packet...' : 'Transmit Test Emergency Packet'}</span>
      </button>

      {/* Nodes Stack */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>
          Active Radio Nodes ({nodes.length})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
          {nodes.map(node => (
            <div
              key={node.id}
              className="resq-card-panel"
              style={{ padding: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {node.name}
                </span>
                <span className="tactical-badge badge-cyan" style={{ fontSize: 8 }}>
                  {node.protocol}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                <span>ID: <b>{node.nodeId}</b></span>
                <span>Battery: <b>{node.battery}%</b></span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{node.relayedCount} Relayed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packet Buffer & Log */}
      <div className="resq-grid-2col">
        
        {/* Buffer */}
        <div className="resq-card-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Database size={15} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>
              Store-and-Forward Buffer
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {buffer.map((pkt, i) => (
              <div key={i} style={{ background: 'var(--bg-tertiary)', padding: 8, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, marginBottom: 2 }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>{pkt.packetId}</span>
                  <span className="tactical-badge badge-emerald" style={{ fontSize: 8 }}>{pkt.status}</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{pkt.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Logs */}
        <div className="resq-card-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Activity size={15} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>
              Radio Hop Activity Log
            </h3>
          </div>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: 8,
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
