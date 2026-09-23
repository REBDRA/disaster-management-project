# RESQ — Adaptive Dual-Engine Evacuation & AI Flood Intelligence Platform

> **Civic Evacuation Intelligence & Early Warning for Catastrophic Inundation and Infrastructure Blackouts.**  
> 100% Web2 offline-first architecture with on-device SRTM 30m Digital Elevation Models (DEM), 48-Hour Inundation Timeline forecasting, CWC river gauge telemetry, and ad-hoc radio store-and-forward mesh.

---

## 🌟 Key Features

1. **Dual-Theme Adaptive Civic UI (Light Theme Default)**
   - **Light Theme (Default / Primary):** High-contrast, clean civic command interface engineered for daytime clarity, outdoor usability, and rapid emergency triage.
   - **Dark Theme:** Switchable tactical night mode with one-tap toggle and instant `localStorage` persistence.

2. **Where & When Flood Intelligence (48-Hour Timeline Forecast Engine)**
   - **Active Flood Inundation Zones:** Visual water depth heatmaps (Submerged, Imminent Surge, Safe High Ground).
   - **48-Hour Timeline Simulation Player (+0h to +48h):** Interactive time scrubber that dynamically simulates rising river surges, submerges low-lying roads in real time, and recalculates safe evacuation routes.
   - **Central Water Commission (CWC) River Gauge Telemetry:** Live monitoring for Brahmaputra, Ganga, Hooghly, Periyar, and Mithi basins with Danger Level, Warning Mark, Rate of Rise (m/hr), and Breach ETA countdowns.

3. **100% Offline Resilience (Zero-Cloud PWA)**
   - **Service Worker Caching (`public/sw.js`):** Pre-caches app shell, map tiles, and offline datasets.
   - **Local IndexedDB / Storage Manager:** District packs (Assam, West Bengal, Bihar, Kerala, Mumbai) pre-cached for zero-connectivity routing.
   - **On-Device Dijkstra Elevation Routing:** Computes safe, dry paths to elevated sanctuaries without internet.
   - **Offline SOS & Hazard Queuing:** Local storage buffers emergency distress alerts and syncs automatically when network reconnects.

4. **Emergency Relief Treasury & Aid Distribution (Web2)**
   - **State Disaster Relief (SDRF / PMNRF) Mobilization:** Transparent tracking of disaster relief funds.
   - **Direct Benefit Transfer (DBT):** Direct aid disbursement simulator for affected citizen households.
   - **Emergency Relief Payment Gateway:** Instant contribution gateway via UPI, Cards, and NetBanking.
   - **Logistics & Resource Inventory Tracker:** Potable water, trauma med kits, ration packs, and rescue boats.

5. **Local Emergency Radio & Store-and-Forward Mesh (LoRa / BLE 5.3)**
   - Device-to-device multi-hop packet forwarding over 868MHz / BLE / Wi-Fi Direct.
   - Zero-hardware store-and-forward buffer delivering emergency signals across volunteer nodes to NDRF HQ.

6. **NDRF / SDRF Tactical Command HUD**
   - Live incident dispatch queue, rescue boat allocation, and civil defense mass broadcast console.

---

## 🚀 Quick Start

### Start Frontend Application
```bash
npm install
npm run dev
```
Open `http://127.0.0.1:5173` in your browser.

---

## 📁 Project Architecture

```
├── public/
│   └── sw.js                     # Offline Service Worker for asset & tile caching
├── src/
│   ├── App.jsx                   # Theme provider, tab manager & offline listeners
│   ├── index.css                 # Dual-theme design system (Light default + Dark)
│   ├── components/
│   │   ├── Navbar.jsx            # Light/Dark toggle, network status, SOS trigger
│   │   ├── EvacuationMap.jsx     # Flood timeline forecast, map layers & route engine
│   │   ├── FloodForecastDashboard.jsx # AI early warning, CWC river gauges & ETAs
│   │   ├── ReliefFundTreasury.jsx # Web2 emergency relief & DBT disbursement
│   │   ├── OfflineDistrictPacks.jsx # IndexedDB DEM & vector map pack manager
│   │   ├── MeshSimulator.jsx     # LoRa 868MHz / BLE store-and-forward mesh
│   │   ├── ResponderDashboard.jsx# NDRF/SDRF emergency triage & boat fleet
│   │   ├── SosModal.jsx          # Web2 citizen emergency SOS beacon
│   │   ├── SlideDeckModal.jsx    # Interactive presentation slide deck
│   │   ├── ImpactAndResilience.jsx # 5-step resilience cycle & impact stats
│   │   └── ResearchReferences.jsx# CWC, NASA SRTM, NDRF academic citations
│   └── utils/
│       ├── floodForecastEngine.js# 48-hour timeline hydrological model
│       ├── offlineManager.js     # IndexedDB / LocalStorage offline sync engine
│       ├── geoRouting.js         # On-device elevation A* routing & hazards
│       ├── meshEngine.js         # Radio mesh nodes & buffer topology
│       └── audioEffects.js       # Web Audio API tactical sound synthesizer
```
