// Local Emergency Store-and-Forward P2P Mesh Network Engine (Web2 Radio / BLE / LoRa)

export const INITIAL_MESH_NODES = [
  {
    id: 'node-user',
    name: 'You (Citizen Mobile Device)',
    type: 'CITIZEN',
    x: 120,
    y: 280,
    battery: 84,
    protocol: 'BLE 5.3 / Wi-Fi Direct',
    status: 'ONLINE_ACTIVE',
    relayedCount: 0,
    nodeId: 'NODE-CITIZEN-042'
  },
  {
    id: 'node-peer-1',
    name: 'Civilian Peer A (Rooftop Antenna)',
    type: 'PEER',
    x: 270,
    y: 210,
    battery: 91,
    protocol: 'BLE 5.2 / P2P',
    status: 'RELAY_ACTIVE',
    relayedCount: 14,
    nodeId: 'NODE-PEER-881'
  },
  {
    id: 'node-peer-2',
    name: 'Civilian Evacuee B (Vehicle Hub)',
    type: 'PEER',
    x: 430,
    y: 310,
    battery: 67,
    protocol: 'Wi-Fi Direct P2P',
    status: 'RELAY_ACTIVE',
    relayedCount: 8,
    nodeId: 'NODE-PEER-309'
  },
  {
    id: 'node-beacon',
    name: 'Solar LoRa Mesh Repeater #12',
    type: 'LORA_BEACON',
    x: 580,
    y: 190,
    battery: 100,
    protocol: 'LoRa 868MHz + BLE',
    status: 'GATEWAY_READY',
    relayedCount: 47,
    nodeId: 'NODE-LORA-12'
  },
  {
    id: 'node-drone',
    name: 'SDRF Drone Relay Delta-1',
    type: 'DRONE_UAV',
    x: 720,
    y: 130,
    battery: 88,
    protocol: 'Long-Range RF 433MHz',
    status: 'AIRBORNE_RELAY',
    relayedCount: 62,
    nodeId: 'NODE-DRONE-01'
  },
  {
    id: 'node-gateway',
    name: 'NDRF Tactical Base Command',
    type: 'GATEWAY_BASE',
    x: 880,
    y: 240,
    battery: 100,
    protocol: 'Satellite WAN / VHF',
    status: 'CONNECTED_HQ',
    relayedCount: 184,
    nodeId: 'NODE-NDRF-HQ'
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

export const STORE_AND_FORWARD_BUFFER = [
  {
    packetId: 'PKT-SOS-9812',
    senderId: 'NODE-CITIZEN-109',
    triageLevel: 'RED_CRITICAL',
    message: 'Trapped on 2nd floor, water rising above stairs. 3 seniors.',
    hops: 3,
    status: 'DELIVERED_TO_HQ'
  },
  {
    packetId: 'PKT-HAZ-4401',
    senderId: 'NODE-PEER-881',
    triageLevel: 'YELLOW_WARNING',
    message: 'Tree fallen across MG Road bypass near Milepost 4.',
    hops: 2,
    status: 'BROADCASTING_LOCAL'
  }
];
