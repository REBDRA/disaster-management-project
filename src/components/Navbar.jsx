import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  CloudOff, 
  Cloud, 
  Volume2, 
  VolumeX, 
  BookOpen
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';

export default function Navbar({
  isBlackoutMode,
  setIsBlackoutMode,
  activePeersCount,
  onOpenSos,
  onOpenDeck,
  soundEnabled,
  setSoundEnabled
}) {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('click');
  };

  const toggleMode = () => {
    if (soundEnabled) playSound('alert');
    setIsBlackoutMode(!isBlackoutMode);
  };

  return (
    <header className="resq-navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div className="resq-navbar-inner" style={{
        maxWidth: 1600,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        {/* Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #00f2fe 0%, #ff2a5f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
          }}>
            <ShieldAlert size={24} color="#070a12" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="resq-brand-text" style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 1.2,
                background: 'linear-gradient(90deg, #00f2fe, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                RESQ
              </span>
              <span className="tactical-badge badge-cyan resq-brand-badge">
                INTELLIGENCE v2.0
              </span>
            </div>
            <div className="resq-brand-tagline" style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Adaptive Dual-Engine Evacuation Intelligence</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Radio size={12} className="radar-ping" /> {activePeersCount} Mesh Nodes Active
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Dual-Mode Switcher */}
        <div className="resq-mode-switcher" style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => isBlackoutMode && toggleMode()}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: !isBlackoutMode ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
              color: !isBlackoutMode ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: !isBlackoutMode ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Cloud size={14} />
            <span className="resq-mode-label-full">Cloud / RPC Mode</span>
            <span className="resq-mode-label-short">Cloud</span>
          </button>
          <button
            onClick={() => !isBlackoutMode && toggleMode()}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: isBlackoutMode ? 'rgba(255, 42, 95, 0.22)' : 'transparent',
              color: isBlackoutMode ? '#ff4d79' : 'var(--text-muted)',
              borderBottom: isBlackoutMode ? '2px solid #ff2a5f' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            <CloudOff size={14} />
            <span className="resq-mode-label-full">Blackout Mesh Mode (P2P Zero-Cellular)</span>
            <span className="resq-mode-label-short">Blackout Mesh</span>
          </button>
        </div>

        {/* Right Tools: Web3 Pitch Deck, Sound, Wallet, SOS */}
        <div className="resq-nav-tools" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Pitch Deck button */}
          <button 
            className="btn-ghost resq-pitchdeck-btn"
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenDeck();
            }}
            title="View Hackathon Pitch Deck"
          >
            <BookOpen size={15} color="var(--accent-cyan)" />
            <span className="resq-pitchdeck-label">Pitch Deck</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="btn-ghost"
            style={{ padding: '8px 10px' }}
            title={soundEnabled ? 'Mute Audio' : 'Enable Tactical Audio'}
          >
            {soundEnabled ? (
              <Volume2 size={16} color="var(--accent-emerald)" />
            ) : (
              <VolumeX size={16} color="var(--text-muted)" />
            )}
          </button>

          {/* ONE TAP SOS TRIGGER */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('sos');
              onOpenSos();
            }}
            className="btn-sos resq-sos-btn"
          >
            <ShieldAlert size={18} />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
