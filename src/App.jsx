import React, { useState } from 'react';
import { 
  Map, 
  Radio, 
  Vault, 
  ShieldAlert, 
  Database, 
  CloudOff, 
  DownloadCloud,
  CheckCircle,
  Brain,
  Activity,
  BookOpen
} from 'lucide-react';
import Navbar from './components/Navbar';
import EvacuationMap from './components/EvacuationMap';
import MeshSimulator from './components/MeshSimulator';
import ReliefVault from './components/ReliefVault';
import ResponderDashboard from './components/ResponderDashboard';
import BittensorSubnet from './components/BittensorSubnet';
import ImpactAndResilience from './components/ImpactAndResilience';
import ResearchReferences from './components/ResearchReferences';
import SosModal from './components/SosModal';
import SlideDeckModal from './components/SlideDeckModal';
import IpfsElevationPacks from './components/IpfsElevationPacks';
import { INITIAL_HAZARDS } from './utils/geoRouting';
import { IPFS_MAP_PACKS, generateBurnerIdentity } from './utils/web3Mock';
import { playSound } from './utils/audioEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState('MAP');
  const [isBlackoutMode, setIsBlackoutMode] = useState(false);
  const [waterLevel, setWaterLevel] = useState(2.5);
  const [selectedShelterId, setSelectedShelterId] = useState('shelter-1');
  const [hazards, setHazards] = useState(INITIAL_HAZARDS);
  
  // Web3 state
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState('0x71CB49c1221D40632D2833F424c53d1000bB48D');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          return;
        }
      } catch (err) {
        console.warn('Injected wallet rejected or unavailable, falling back to ResQ DID', err);
      }
    }
    // Burner DID fallback
    setWalletAddress(generateBurnerIdentity());
    setWalletConnected(true);
  };

  const handleTabChange = (tabId) => {
    if (soundEnabled) playSound('click');
    setActiveTab(tabId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Cyber Navigation Bar */}
      <Navbar
        isBlackoutMode={isBlackoutMode}
        setIsBlackoutMode={setIsBlackoutMode}
        activePeersCount={6}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenDeck={() => setIsDeckOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Blackout Mode Tactical Notice Banner */}
      {isBlackoutMode && (
        <div className="resq-blackout-banner" style={{
          background: 'linear-gradient(90deg, #ff2a5f 0%, #ff5e36 100%)',
          color: '#ffffff',
          padding: '8px 24px',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          boxShadow: '0 4px 20px rgba(255, 42, 95, 0.4)'
        }}>
          <CloudOff size={16} />
          <span className="resq-blackout-text">CELLULAR & POWER GRID BLACKOUT ACTIVE — Dual-Engine switched to On-Device Elevation Routing & P2P Mesh Gossip Relay</span>
          <span className="tactical-badge" style={{ background: 'rgba(0,0,0,0.3)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}>
            ZERO CLOUD DEPENDENCY
          </span>
        </div>
      )}

      {/* Primary Tab Navigation & Telemetry Toolbar */}
      <div className="resq-toolbar" style={{
        maxWidth: 1600,
        width: '100%',
        margin: '0 auto',
        padding: '16px 24px 0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Navigation Tabs */}
        <div className="resq-tab-bar" style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'MAP', label: 'Adaptive Evacuation Map', icon: <Map size={15} /> },
            { id: 'MESH', label: 'DePIN P2P Mesh Relay', icon: <Radio size={15} /> },
            { id: 'RESPONDER', label: 'NDRF / SDRF Triage Center', icon: <ShieldAlert size={15} /> },
            { id: 'IMPACT', label: 'Resilience Cycle & Impact', icon: <Activity size={15} /> },
            { id: 'RESEARCH', label: 'Research & References', icon: <BookOpen size={15} /> },
            { id: 'BITTENSOR', label: 'Bittensor AI Subnet 42', icon: <Brain size={15} /> },
            { id: 'VAULT', label: 'On-Chain Relief Vault', icon: <Vault size={15} /> },
            { id: 'IPFS', label: 'IPFS Elevation Packs', icon: <Database size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              title={tab.label}
              className={`btn-ghost resq-tab ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              <span className="resq-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="resq-status-pills" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="code-pill">
            SRTM DEM: 30m HIGH-RES
          </div>
          <div className="code-pill" style={{ color: 'var(--accent-emerald)' }}>
            L2 RPC: ARBITRUM SEPOLIA (421614)
          </div>
          <div className="code-pill">
            GOSSIPSUB v1.2: 100% P2P
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="resq-main" style={{ maxWidth: 1600, width: '100%', margin: '0 auto', padding: '16px 24px 24px 24px', flex: 1 }}>
        {activeTab === 'MAP' && (
          <EvacuationMap
            isBlackoutMode={isBlackoutMode}
            setIsBlackoutMode={setIsBlackoutMode}
            waterLevel={waterLevel}
            setWaterLevel={setWaterLevel}
            selectedShelterId={selectedShelterId}
            setSelectedShelterId={setSelectedShelterId}
            soundEnabled={soundEnabled}
            hazards={hazards}
            setHazards={setHazards}
          />
        )}

        {activeTab === 'MESH' && (
          <MeshSimulator
            isBlackoutMode={isBlackoutMode}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'BITTENSOR' && (
          <BittensorSubnet
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'VAULT' && (
          <ReliefVault
            soundEnabled={soundEnabled}
            walletConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
          />
        )}

        {activeTab === 'RESPONDER' && (
          <ResponderDashboard
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'IMPACT' && (
          <ImpactAndResilience
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'RESEARCH' && (
          <ResearchReferences />
        )}

        {activeTab === 'IPFS' && (
          <IpfsElevationPacks
            soundEnabled={soundEnabled}
            onSelectRegionAndGoToMap={(regionKey) => {
              setActiveTab('MAP');
            }}
          />
        )}
      </main>

      {/* SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        walletAddress={walletAddress}
        soundEnabled={soundEnabled}
        onSosBroadcast={(signed) => {
          console.log('Signed SOS broadcast to mesh:', signed);
        }}
      />

      {/* Pitch Deck Modal */}
      <SlideDeckModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        soundEnabled={soundEnabled}
      />

    </div>
  );
}
