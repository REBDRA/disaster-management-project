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
  Sparkles,
  Cpu
} from 'lucide-react';
import Navbar from './components/Navbar';
import EvacuationMap from './components/EvacuationMap';
import AiDisasterIntelligence from './components/AiDisasterIntelligence';
import MeshSimulator from './components/MeshSimulator';
import ReliefFundTreasury from './components/ReliefFundTreasury';
import ResponderDashboard from './components/ResponderDashboard';
import OfflineDistrictPacks from './components/OfflineDistrictPacks';
import ImpactAndResilience from './components/ImpactAndResilience';
import ResearchReferences from './components/ResearchReferences';
import SosModal from './components/SosModal';
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
  
  // Citizen Emergency SOS Modal
  const [isSosOpen, setIsSosOpen] = useState(false);

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      {/* Top Navigation Bar */}
      <Navbar
        isBlackoutMode={isBlackoutMode}
        setIsBlackoutMode={setIsBlackoutMode}
        theme={theme}
        setTheme={setTheme}
        isNetworkOnline={isNetworkOnline}
        activePeersCount={6}
        onOpenSos={() => setIsSosOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Blackout Mode Notice Banner */}
      {isBlackoutMode && (
        <div className="resq-blackout-banner" style={{
          background: 'linear-gradient(90deg, var(--accent-red) 0%, #ea580c 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(225, 29, 72, 0.3)'
        }}>
          <CloudOff size={14} />
          <span className="resq-blackout-text">
            BLACKOUT ACTIVE — Dual-Engine running 100% on-device SRTM Elevation Routing & Local Radio Mesh
          </span>
        </div>
      )}

      {/* Primary Tab Bar */}
      <div className="resq-toolbar">
        <div className="resq-tab-bar">
          {[
            { id: 'MAP', label: 'Evacuation Map', icon: <Map size={13} /> },
            { id: 'DISASTER_AI', label: 'AI Disaster Warning', icon: <Cpu size={13} /> },
            { id: 'RESPONDER', label: 'NDRF Triage', icon: <ShieldAlert size={13} /> },
            { id: 'TREASURY', label: 'Relief Treasury', icon: <Building2 size={13} /> },
            { id: 'OFFLINE_PACKS', label: 'Offline Packs', icon: <HardDrive size={13} /> },
            { id: 'MESH', label: 'Radio Mesh', icon: <Radio size={13} /> },
            { id: 'IMPACT', label: 'Resilience', icon: <Activity size={13} /> },
            { id: 'RESEARCH', label: 'References', icon: <BookOpen size={13} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`resq-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      <main className="resq-main">
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

        {activeTab === 'DISASTER_AI' && (
          <AiDisasterIntelligence
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

    </div>
  );
}
