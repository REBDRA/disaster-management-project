// Web3 & Cryptographic protocol simulations for ResQ

export const IPFS_MAP_PACKS = [
  {
    region: 'Guwahati & Brahmaputra Basin (High Risk)',
    cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    size: '42.8 MB',
    elevationModel: 'SRTM 30m DEM v4.1',
    verified: true,
  },
  {
    region: 'Patna & North Bihar Flood Plains',
    cid: 'bafybeic5y4s32pbf6n2a3y5zrt7ujg3q2f5g3g7n4t2v9x1b7h4k9m3q1a',
    size: '56.2 MB',
    elevationModel: 'Copernicus GLO-30 DEM',
    verified: true,
  },
  {
    region: 'Sundarbans Coastal Delta (Tidal Surge)',
    cid: 'bafybeifk43n98t1m2l3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h',
    size: '38.4 MB',
    elevationModel: 'ALOS PALSAR High-Res',
    verified: true,
  }
];

// Initial mock smart contract state
export const INITIAL_RELIEF_VAULT = {
  contractAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
  chain: 'Arbitrum Sepolia / ResQ-Mesh L2',
  totalBalanceEth: 28.45,
  totalBalanceUsdc: 84350,
  disbursedUsdc: 32100,
  quadraticMultiplier: '2.4x Match Active',
  donations: [
    {
      txHash: '0x3a8f...92d1',
      donor: '0x4E2B...F81A (CryptoRelief.eth)',
      amount: '5.0 ETH',
      time: '12 mins ago',
      purpose: 'Emergency Food & Helicopter Fuel'
    },
    {
      txHash: '0x7b1c...a440',
      donor: '0x992C...321E',
      amount: '10,000 USDC',
      time: '34 mins ago',
      purpose: 'Boat Rescue Operation Bounties'
    },
    {
      txHash: '0x9e4d...60bc',
      donor: '0x18Fe...98bC (Vitalik Grants)',
      amount: '12.5 ETH',
      time: '2 hours ago',
      purpose: 'P2P Mesh Battery & DePIN Hardware Reserve'
    }
  ],
  bounties: [
    {
      id: 'BOUNTY-001',
      title: 'Rescue 4 Stranded Citizens - Ward 8 Island',
      reward: '750 USDC',
      status: 'DISPATCHED',
      responder: 'SDRF Boat Unit 3 (0x7a3...89f)'
    },
    {
      id: 'BOUNTY-002',
      title: 'Deliver Insulin Kit to High Ground Ridge Base',
      reward: '350 USDC',
      status: 'OPEN',
      responder: 'Unassigned'
    },
    {
      id: 'BOUNTY-003',
      title: 'Deploy P2P Solar Gateway Beacon on Hilltop',
      reward: '500 USDC',
      status: 'COMPLETED',
      responder: 'Civilian Ham Radio Node #14'
    }
  ]
};

// Generate realistic dummy Ethereum address or get injected wallet
export function generateBurnerIdentity() {
  const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${hex}`;
}

// Simulated EIP-712 Typed Data Signer for Tamper-Proof SOS
export function signSOSPacket(sosData, userAddress) {
  const timestamp = Date.now();
  const domain = {
    name: 'ResQ Evacuation Protocol',
    version: '2.0.0',
    chainId: 421614, // Arbitrum Sepolia
    verifyingContract: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  };

  // Mock ECDSA signature (65 bytes hex)
  const r = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const s = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const v = '1b'; // 27
  const signature = `0x${r}${s}${v}`;

  return {
    ...sosData,
    timestamp,
    senderAddress: userAddress,
    domain,
    signature,
    hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    verified: true,
    proofOfRelayCount: 0
  };
}
