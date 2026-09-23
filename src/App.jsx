import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Radio, 
  Building2, 
  ShieldAlert, 
  HardDrive, 
  CloudOff, 
  Activity, 
  BookOpen,
  Waves,
  Database,
  Wifi,
  Sparkles
} from 'lucide-react';
import Navbar from './components/Navbar';
import EvacuationMap from './components/EvacuationMap';
import FloodForecastDashboard from './components/FloodForecastDashboard';
import MeshSimulator from './components/MeshSimulator';
import ReliefFundTreasury from './components/ReliefFundTreasury';
import ResponderDashboard from './components/ResponderDashboard';
import OfflineDistrictPacks from './components/OfflineDistrictPacks';
import ImpactAndResilience from './components/ImpactAndResilience';
import ResearchReferences from './components/ResearchReferences';
import SosModal from './components/SosModal';
import SlideDeckModal from './components/SlideDeckModal';
import { INITIAL_HAZARDS } from './utils/geoRouting';
import { registerServiceWorker } from './utils/offlineManager';
import { playSound } from './utils/audioEffects';

export default function App() {
  // Theme state: defaults to 'light' (as requested)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('resq_theme_mode') || 'light';
    } catch {
      return 'light';
    }
  });

  const [activeTab, setActiveTab] = useState('MAP');
  const [isBlackoutMode, setIsBlackoutMode] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);
  const [waterLevel, setWaterLevel] = useState(2.2);
  const [selectedShelterId, setSelectedShelterId] = useState('shelter-1');
  const [hazards, setHazards] = useState(INITIAL_HAZARDS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  // Sync theme attribute to <html> and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('resq_theme_mode', theme);
    } catch (err) {
      console.warn(err);
    }
  }, [theme]);

  // Online / Offline network listeners & Service Worker registration
  useEffect(() => {
    registerServiceWorker();

    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    if (typeof window !== 'undefined') {
      setIsNetworkOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTabChange = (tabId) => {
    if (soundEnabled) playSound('click');
    setActiveTab(tabId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Civic Intelligence Navigation Bar */}
      <Navbar
        isBlackoutMode={isBlackoutMode}
        setIsBlackoutMode={setIsBlackoutMode}
        theme={theme}
        setTheme={setTheme}
        isNetworkOnline={isNetworkOnline}
        activePeersCount={6}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenDeck={() => setIsDeckOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Blackout Mode Notice Banner */}
      {isBlackoutMode && (
        <div className="resq-blackout-banner" style={{
          background: 'linear-gradient(90deg, var(--accent-red) 0%, #ea580c 100%)',
          color: '#ffffff',
          padding: '8px 24px',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          boxShadow: '0 4px 20px rgba(225, 29, 72, 0.4)'
        }}>
          <CloudOff size={16} />
          <span className="resq-blackout-text">
            TELECOM & POWER BLACKOUT ACTIVE — Dual-Engine running 100% on-device SRTM Elevation Routing & Local Radio Mesh
          </span>
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
        <div className="resq-tab-bar" style={{
          display: 'flex',
          gap: 6,
          background: 'var(--tab-bar-bg)',
          padding: 4,
          borderRadius: 12,
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {[
            { id: 'MAP', label: 'Evacuation Map & Timeline', icon: <Map size={15} /> },
            { id: 'FLOOD_AI', label: 'AI Flood Warning & Inundation', icon: <Waves size={15} /> },
            { id: 'RESPONDER', label: 'NDRF / SDRF Triage Center', icon: <ShieldAlert size={15} /> },
            { id: 'TREASURY', label: 'Emergency Relief Treasury', icon: <Building2 size={15} /> },
            { id: 'OFFLINE_PACKS', label: 'Offline District Packs', icon: <HardDrive size={15} /> },
            { id: 'MESH', label: 'Local Radio Mesh Relay', icon: <Radio size={15} /> },
            { id: 'IMPACT', label: 'Resilience Cycle', icon: <Activity size={15} /> },
            { id: 'RESEARCH', label: 'Research & Citations', icon: <BookOpen size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              title={tab.label}
              className={`btn-ghost resq-tab ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              <span className="resq-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Status Telemetry Pills */}
        <div className="resq-status-pills" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="code-pill">
            SRTM DEM: 30m HIGH-RES
          </div>
          <div className="code-pill" style={{ color: 'var(--accent-emerald)' }}>
            LOCAL INDEXEDDB CACHE
          </div>
          <div className="code-pill">
            CWC GAUGE TELEMETRY
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="resq-main" style={{ maxWidth: 1600, width: '100%', margin: '0 auto', padding: '16px 24px 24px 24px', flex: 1 }}>
        {activeTab === 'MAP' && (
          <EvacuationMap
            theme={theme}
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

        {activeTab === 'FLOOD_AI' && (
          <FloodForecastDashboard
            soundEnabled={soundEnabled}
            selectedTimelineHour={0}
            onSelectTimelineHour={(hourOffset) => {
              const matched = [2.2, 3.4, 4.8, 5.6, 4.9, 2.8];
              const idx = [0, 3, 6, 12, 24, 48].indexOf(hourOffset);
              if (idx !== -1) {
                setWaterLevel(matched[idx]);
              }
            }}
          />
        )}

        {activeTab === 'RESPONDER' && (
          <ResponderDashboard
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'TREASURY' && (
          <ReliefFundTreasury
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'OFFLINE_PACKS' && (
          <OfflineDistrictPacks
            soundEnabled={soundEnabled}
            onSelectRegionAndGoToMap={(regionKey) => {
              setActiveTab('MAP');
            }}
          />
        )}

        {activeTab === 'MESH' && (
          <MeshSimulator
            isBlackoutMode={isBlackoutMode}
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
      </main>

      {/* Citizen Emergency SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        soundEnabled={soundEnabled}
        onSosBroadcast={(payload) => {
          console.log('Dispatched Web2 Citizen SOS:', payload);
        }}
      />

      {/* Slide Deck Modal */}
      <SlideDeckModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        soundEnabled={soundEnabled}
      />

    </div>
  );
}
