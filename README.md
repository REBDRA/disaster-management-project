# RESQ Web3 — Adaptive Dual-Mode Evacuation & DePIN Mesh Platform

> **Decentralized Evacuation Intelligence for Catastrophic Infrastructure Failures.**  
> Built for hackathons at the intersection of Disaster Management, DePIN (Decentralized Physical Infrastructure Networks), and Public Goods.

---

## 🌟 Key Features

1. **Dual-Mode Disaster Engine**
   - **Cloud / RPC Mode:** High-throughput geospatial analysis and live API updates.
   - **Zero-Cellular Blackout Mesh Mode:** Instant fallback to on-device elevation A* routing and Bluetooth/Wi-Fi Direct P2P mesh relay.

2. **Elevation-Aware Adaptive Evacuation Map**
   - Real-time flood surge simulator (+0m to +12m).
   - High-ground ridge navigation (SRTM 30m DEM) routing to safe shelters.
   - Dynamic route confidence scoring powered by Bittensor Subnet 42 consensus.
   - Community-reported road hazards with local Byzantine Fault-Tolerant (BFT) peer consensus.

3. **Bittensor Subnet 42: Decentralized Disaster AI Intelligence**
   - Swarm of specialized ML Miners: Hydrological flood dynamics, Sentinel-1 SAR satellite water detection, and stochastic evacuation routing.
   - Evaluated via Yuma Consensus with $TAO token emissions.
   - Distills continuous swarm intelligence into a quantized 8.4 MB ONNX edge model for offline, zero-cloud smartphones.

4. **DePIN Zero-Hardware P2P Mesh Visualizer**
   - 2D animated topological network simulating hop-by-hop packet propagation.
   - Store-and-forward offline buffer for total telecom blackouts.
   - **Proof-of-Relay (PoR):** Micro-incentives in `$RESQ` tokens for citizen devices that relay emergency packets.

4. **On-Chain Disaster Relief Smart Vault**
   - Non-custodial escrow pool on Arbitrum L2.
   - Gitcoin 2.4x Quadratic Matching multiplier.
   - First responder bounties released upon verified proof of rescue.
   - Interactive contribution portal and transparent disbursement ledger.

5. **NDRF / SDRF Tactical Dispatch HUD**
   - Triage-prioritized incoming SOS distress queue.
   - One-click rescue boat and drone airdrop dispatch.
   - Emergency evacuation broadcast disseminated across the P2P gossip mesh.

6. **Cryptographic One-Tap SOS Beacon**
   - EIP-712 ECDSA signed tamper-proof distress attestation with GPS coordinates, elevation, battery level, and victim DID.

---

## 🚀 Quick Start

### 1. Start Custom Backend API (FastAPI)
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- API Endpoint: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

### 2. Start Frontend Web Application (Vite + React)
```bash
npm install
npm run dev
```
- App UI: `http://127.0.0.1:5173`

---

## 🔌 Custom API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/route/adaptive` | Computes elevation-aware safe routing avoiding floodwater submergence |
| `POST` | `/api/elevation/lookup` | Custom in-memory Digital Elevation Model (DEM) lookup |
| `POST` | `/api/sos/broadcast` | Receives and stores cryptographic SOS distress beacons |
| `GET` | `/api/sos/feed` | Real-time prioritized triage queue for first responders (NDRF/SDRF) |
| `POST` | `/api/hazards/report` | Reports community hazards with peer consensus |
| `GET` | `/api/hazards/active` | Active road obstruction feed |
| `GET` | `/api/bittensor/swarm` | Live Bittensor Subnet 42 miner consensus & predictions |
| `WS` | `/ws/telemetry` | Real-time WebSocket disaster telemetry bus |

---

## 📂 Project Structure

```
├── RESQ_WEB3_PRESENTATION_DECK.md  # 6-Slide Web3 Pitch Deck document
├── index.html                      # App HTML entry with Google Fonts & Leaflet CDN
├── package.json
└── src/
    ├── App.jsx                     # Main tabs & cyber-emergency container
    ├── index.css                   # Cyber-emergency dark glassmorphism design system
    ├── components/
    │   ├── Navbar.jsx              # Header with dual-mode switch & wallet connect
    │   ├── EvacuationMap.jsx       # Interactive Leaflet map with flood simulation
    │   ├── MeshSimulator.jsx       # DePIN P2P mesh packet hop & PoR rewards
    │   ├── ReliefVault.jsx         # On-chain smart treasury, bounties & donation
    │   ├── ResponderDashboard.jsx  # NDRF/SDRF tactical triage & alert broadcast
    │   ├── SosModal.jsx            # One-tap cryptographic SOS beacon modal
    │   └── SlideDeckModal.jsx      # Interactive 6-slide Web3 deck viewer
    └── utils/
        ├── audioEffects.js         # Web Audio API tactical sound synthesizer
        ├── geoRouting.js           # Elevation A* routing & flood calculation
        ├── meshEngine.js           # DePIN mesh topology & store-and-forward buffer
        └── web3Mock.js             # EIP-712 signer, IPFS registry & smart contract
```
