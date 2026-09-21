import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  Wifi, 
  Coins, 
  Send, 
  Database, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_MESH_NODES, MESH_CONNECTIONS, STORE_AND_FORWARD_BUFFER } from '../utils/meshEngine';
import { playSound } from '../utils/audioEffects';

export default function MeshSimulator({ isBlackoutMode, soundEnabled }) {
  const [nodes, setNodes] = useState(INITIAL_MESH_NODES);
  const [buffer, setBuffer] = useState(STORE_AND_FORWARD_BUFFER);
  const [isHopping, setIsHopping] = useState(false);
  const [userClaimableRewards, setUserClaimableRewards] = useState(45);
  const [logs, setLogs] = useState([
    '🟢 BLE 5.3 mesh initialized. 6 localized DePIN peers discovered.',
    '📶 Consensus peer verification established via local Gossipsub.',
    '⚡ Zero-Hardware mode active. Store-and-Forward buffer operational.'
  ]);

  // Trigger a full simulated DePIN packet hop from Citizen to NDRF Gateway
  const simulatePacketHop = () => {
    if (isHopping) return;
    setIsHopping(true);

    const hopSequence = [
      { step: 0, from: 'node-user', to: 'node-peer-1', text: 'Citizen -> Civilian Peer A (BLE 5.3)' },
      { step: 1, from: 'node-peer-1', to: 'node-beacon', text: 'Civilian Peer A -> Solar Repeater #12 (LoRa/Mesh)' },
      { step: 2, from: 'node-beacon', to: 'node-drone', text: 'Solar Repeater -> SDRF Drone Delta-1 (Long Range RF)' },
      { step: 3, from: 'node-drone', to: 'node-gateway', text: 'Drone Delta-1 -> NDRF Base Gateway (Starlink Uplink)' }
    ];

    let current = 0;

    const interval = setInterval(() => {
      if (current < hopSequence.length) {
        const item = hopSequence[current];
        if (soundEnabled) playSound('hop');

        setLogs(prev => [
          `📦 Hop #${item.step + 1}: ${item.text}`,
          ...prev.slice(0, 7)
        ]);

        // Increment rewards on relayed nodes
        setNodes(prevNodes => prevNodes.map(n => {
          if (n.id === item.from || n.id === item.to) {
            return {
              ...n,
              relayedCount: n.relayedCount + 1,
              rewardsEarned: n.rewardsEarned + 15
            };
          }
          return n;
        }));

        current++;
      } else {
        clearInterval(interval);
        setIsHopping(false);
        if (soundEnabled) playSound('success');

        // Add confirmed packet to buffer
        const newPacket = {
          packetId: `PKT-RELAY-${Math.floor(1000 + Math.random() * 9000)}`,
          senderDid: 'did:resq:0x9fa1...89a2',
          triageLevel: 'RED_CRITICAL',
          message: 'Distress attestation verified at satellite gateway. Dispatched on-chain.',
          coords: [26.183, 91.745],
          elevation: 49.2,
          hopHistory: ['node-user', 'node-peer-1', 'node-beacon', 'node-drone', 'node-gateway'],
          timeBuffered: 'Just now',
          status: 'DELIVERED_TO_GATEWAY',
          eip712Sig: '0x' + Math.random().toString(16).substr(2, 8)
        };

        setBuffer(prev => [newPacket, ...prev]);
        setUserClaimableRewards(r => r + 30);

        setLogs(prev => [
          '🎉 Packet safely reached Gateway! Proof-of-Relay attestations minted to all relay nodes.',
          ...prev.slice(0, 7)
        ]);
      }
    }, 1100);
  };

  const handleClaimRewards = () => {
    if (userClaimableRewards === 0) return;
    if (soundEnabled) playSound('success');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });

    setLogs(prev => [
      `💰 Claimed ${userClaimableRewards} $RESQ micro-grants for battery/data relay contributions!`,
      ...prev.slice(0, 7)
    ]);
    setUserClaimableRewards(0);
  };

  return (
    <div className="resq-mesh-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
      
      {/* Topology Canvas & Controls */}
      <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div className="resq-mesh-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={20} color="var(--accent-cyan)" />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                DePIN ZERO-HARDWARE P2P MESH TOPOLOGY
              </span>
              <span className="tactical-badge badge-cyan">
                {isBlackoutMode ? 'STORE & FORWARD MESH' : 'HYBRID L2 MESH'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Device-to-device Bluetooth 5.3 & Wi-Fi Direct multi-hop relay. Zero cell towers required.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={simulatePacketHop}
              disabled={isHopping}
              className="btn-primary"
              style={{ opacity: isHopping ? 0.7 : 1 }}
            >
              <Send size={15} />
              {isHopping ? 'Propagating Packet...' : 'Simulate P2P Hop'}
            </button>
          </div>
        </div>

        {/* Dynamic Topology Node Visualizer */}
        <div className="resq-mesh-topology" style={{
          position: 'relative',
          height: 380,
          background: 'radial-gradient(ellipse at center, rgba(0, 242, 254, 0.04) 0%, rgba(7, 10, 18, 0.95) 100%)',
          borderRadius: 12,
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          marginBottom: 16
        }}>
          {/* SVG Links */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {MESH_CONNECTIONS.map(([idA, idB], idx) => {
              const nodeA = nodes.find(n => n.id === idA);
              const nodeB = nodes.find(n => n.id === idB);
              if (!nodeA || !nodeB) return null;

              return (
                <line
                  key={idx}
                  x1={nodeA.x}
                  y1={nodeA.y}
                  x2={nodeB.x}
                  y2={nodeB.y}
                  stroke="url(#linkGradient)"
                  strokeWidth="2"
                  strokeDasharray="4, 4"
                />
              );
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map(node => {
            const isUser = node.type === 'CITIZEN';
            const isGateway = node.type === 'GATEWAY_BASE';

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 10
                }}
              >
                <div style={{
                  width: isGateway ? 52 : isUser ? 46 : 40,
                  height: isGateway ? 52 : isUser ? 46 : 40,
                  borderRadius: '50%',
                  background: isUser ? 'linear-gradient(135deg, #00f2fe, #0284c7)' : isGateway ? 'linear-gradient(135deg, #ff2a5f, #a855f7)' : 'rgba(15, 23, 42, 0.9)',
                  border: `2px solid ${isUser ? '#00f2fe' : isGateway ? '#ff2a5f' : '#38bdf8'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: `0 0 20px ${isUser ? 'rgba(0, 242, 254, 0.5)' : isGateway ? 'rgba(255, 42, 95, 0.5)' : 'rgba(56, 189, 248, 0.2)'}`
                }}>
                  {isUser ? <Smartphone size={20} /> : isGateway ? <Database size={22} /> : <Wifi size={18} />}
                </div>

                <div style={{
                  marginTop: 6,
                  background: 'rgba(7, 10, 18, 0.85)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>{node.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{node.protocol}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Packet Propagation Logs */}
        <div style={{ background: '#05070d', borderRadius: 8, padding: 12, border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Radio size={13} />
            <span>P2P STORE-AND-FORWARD TELEMETRY LOGS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#94a3b8' }}>
            {logs.map((lg, idx) => (
              <div key={idx}>{lg}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Proof-of-Relay Rewards & Store-and-Forward Buffer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* DePIN Rewards Claim Box */}
        <div className="glass-panel-cyan" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Coins size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>PROOF-OF-RELAY REWARDS</span>
            </div>
            <span className="tactical-badge badge-cyan">HELIUM-STYLE DePIN</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>YOUR UNCLAIMED RELAY BOUNTY</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 2 }}>
              {userClaimableRewards} <span style={{ fontSize: 13, color: '#ffffff' }}>$RESQ</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
              Earned for carrying & forwarding 3 critical SOS packets during network blackout.
            </div>
          </div>

          <button
            onClick={handleClaimRewards}
            disabled={userClaimableRewards === 0}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: userClaimableRewards === 0 ? 0.5 : 1 }}
          >
            <Sparkles size={16} />
            {userClaimableRewards > 0 ? `Claim ${userClaimableRewards} $RESQ Tokens` : 'All Rewards Claimed'}
          </button>
        </div>

        {/* Store-and-Forward Buffer Drawer */}
        <div className="glass-panel" style={{ padding: 18, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={16} color="var(--accent-emerald)" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>STORE-AND-FORWARD BUFFER</span>
            </div>
            <span className="code-pill">{buffer.length} PACKETS</span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>
            Distress packets cached in local device storage awaiting peer proximity or satellite bridge.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto' }}>
            {buffer.map((pkt, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>{pkt.packetId}</span>
                  <span className={`tactical-badge ${pkt.status === 'DELIVERED_TO_GATEWAY' ? 'badge-emerald' : 'badge-amber'}`}>
                    {pkt.status === 'DELIVERED_TO_GATEWAY' ? 'DELIVERED' : 'CACHED'}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '6px 0' }}>
                  {pkt.message}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                  <span>Hops: {pkt.hopHistory.length} peers</span>
                  <span className="code-pill">{pkt.timeBuffered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
