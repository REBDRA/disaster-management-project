// DePIN Store-and-Forward P2P Mesh Network Engine

export const INITIAL_MESH_NODES = [
  {
    id: 'node-user',
    name: 'You (Citizen Device)',
    type: 'CITIZEN',
    x: 120,
    y: 280,
    battery: 84,
    protocol: 'BLE 5.3 / Wi-Fi Direct',
    status: 'ONLINE_ACTIVE',
    relayedCount: 0,
    rewardsEarned: 0,
    did: 'did:resq:0x9fa1...89a2'
  },
  {
    id: 'node-peer-1',
    name: 'Civilian Peer A (Rooftop)',
    type: 'PEER',
    x: 270,
    y: 210,
    battery: 91,
    protocol: 'BLE 5.2 / libp2p',
    status: 'RELAY_ACTIVE',
    relayedCount: 14,
    rewardsEarned: 210,
    did: 'did:resq:0x34f1...190c'
  },
  {
    id: 'node-peer-2',
    name: 'Civilian Evacuee B (SUV)',
    type: 'PEER',
    x: 430,
    y: 310,
    battery: 67,
    protocol: 'Wi-Fi Direct P2P',
    status: 'RELAY_ACTIVE',
    relayedCount: 8,
    rewardsEarned: 120,
    did: 'did:resq:0x7bb2...a4e1'
  },
  {
    id: 'node-beacon',
    name: 'DePIN Solar Mesh Repeater #12',
    type: 'DEPIN_BEACON',
    x: 580,
    y: 190,
    battery: 100,
    protocol: 'LoRa 868MHz + BLE',
    status: 'GATEWAY_READY',
    relayedCount: 47,
    rewardsEarned: 705,
    did: 'did:resq:0x89ee...45cc'
  },
  {
    id: 'node-drone',
    name: 'SDRF Drone Relay Delta-1',
    type: 'DRONE_UAV',
    x: 720,
    y: 130,
    battery: 88,
    protocol: 'Long-Range RF / Mesh',
    status: 'AIRBORNE_RELAY',
    relayedCount: 62,
    rewardsEarned: 930,
    did: 'did:resq:0x51da...883b'
  },
  {
    id: 'node-gateway',
    name: 'NDRF Tactical Base Gateway',
    type: 'GATEWAY_BASE',
    x: 880,
    y: 240,
    battery: 100,
    protocol: 'Starlink Uplink / L2 RPC',
    status: 'SYNCED_TO_CHAIN',
    relayedCount: 184,
    rewardsEarned: 0,
    did: 'did:resq:0xNDRF...GovAuthority'
  }
];

export const MESH_CONNECTIONS = [
  ['node-user', 'node-peer-1'],
  ['node-user', 'node-peer-2'],
  ['node-peer-1', 'node-beacon'],
  ['node-peer-2', 'node-beacon'],
  ['node-beacon', 'node-drone'],
  ['node-drone', 'node-gateway'],
  ['node-beacon', 'node-gateway']
];

// In-memory Store-and-Forward Queue for Blackout Mode
export const STORE_AND_FORWARD_BUFFER = [
  {
    packetId: 'PKT-SOS-9812',
    senderDid: 'did:resq:0x882a...9b11',
    triageLevel: 'RED_CRITICAL',
    message: 'Trapped on 2nd floor, water rising above stairs. 3 seniors.',
    coords: [26.179, 91.739],
    elevation: 48.2,
    hopHistory: ['0x882a...9b11', '0x34f1...190c', '0x89ee...45cc'],
    timeBuffered: '4m 12s ago',
    status: 'DELIVERED_TO_GATEWAY',
    eip712Sig: '0x94f...21c'
  },
  {
    packetId: 'PKT-HAZ-4401',
    senderDid: 'did:resq:0x11ce...008f',
    triageLevel: 'YELLOW_WARNING',
    message: 'Culvert collapsed under MG Road. Deep trench submerged.',
    coords: [26.175, 91.751],
    elevation: 50.1,
    hopHistory: ['0x11ce...008f', '0x7bb2...a4e1'],
    timeBuffered: '1m 45s ago',
    status: 'HOPPING_IN_MESH',
    eip712Sig: '0x88c...b31'
  }
];
