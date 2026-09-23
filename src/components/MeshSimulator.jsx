import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  Wifi, 
  Send, 
  Database, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';
import { INITIAL_MESH_NODES, MESH_CONNECTIONS, STORE_AND_FORWARD_BUFFER } from '../utils/meshEngine';
import { playSound } from '../utils/audioEffects';

export default function MeshSimulator({ isBlackoutMode, soundEnabled }) {
  const [nodes, setNodes] = useState(INITIAL_MESH_NODES);
  const [buffer, setBuffer] = useState(STORE_AND_FORWARD_BUFFER);
  const [isHopping, setIsHopping] = useState(false);
  const [logs, setLogs] = useState([
    '🟢 BLE 5.3 & LoRa mesh initialized. 6 local radio peers connected.',
    '📶 Store-and-Forward packet routing operational on 868MHz frequency.',
    '⚡ Zero-Cellular fallback active: Messages hop across volunteer peer devices.'
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
          `📦 Packet Hop #${item.step + 1}: ${item.text}`,
          ...prev.slice(0, 6)
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
    }, 1100);
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
              background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Radio size={20} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              Local Emergency Radio & Store-and-Forward Mesh Simulator
            </h1>
            <span className="tactical-badge badge-emerald">
              LORA / BLE 5.3 AD-HOC P2P
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Simulates device-to-device packet forwarding when cell towers, fiber internet, and power grids are completely destroyed by floodwaters.
          </p>
        </div>

        <button
          onClick={simulatePacketHop}
          disabled={isHopping}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: 13 }}
        >
          <Send size={15} />
          <span>{isHopping ? 'Forwarding Multi-Hop Packet...' : 'Transmit Test SOS Packet'}</span>
        </button>
      </div>

      {/* Network Topology Visualizer */}
      <div className="glass-panel" style={{ padding: 24, position: 'relative', minHeight: 340, overflow: 'hidden' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>
          Live Ad-Hoc Radio Mesh Topology (Zero-Cellular)
        </h2>

        {/* Mesh Nodes Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {nodes.map(node => (
            <div
              key={node.id}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {node.name}
                </span>
                <span className="tactical-badge badge-cyan" style={{ fontSize: 9 }}>
                  {node.protocol}
                </span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Node ID: <b>{node.nodeId}</b></span>
                <span>Battery: <b>{node.battery}%</b></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderTop: '1px solid var(--border-subtle)', paddingTop: 6, marginTop: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Packets Relayed:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>{node.relayedCount} Packets</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store & Forward Buffer & Live Telemetry Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        
        {/* Packet Buffer Table */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Database size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
              On-Device Store-and-Forward Buffer
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {buffer.map((pkt, i) => (
              <div key={i} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)' }}>{pkt.packetId}</span>
                  <span className="tactical-badge badge-emerald" style={{ fontSize: 9 }}>{pkt.status}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0' }}>{pkt.message}</p>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hops Count: {pkt.hops} • Sender: {pkt.senderId}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Packet Logs */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Activity size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
              Radio Packet Hop Log
            </h3>
          </div>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: 12,
            borderRadius: 8,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-secondary)'
          }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ lineHeight: 1.4 }}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
