import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  CloudOff, 
  Cloud, 
  Volume2, 
  VolumeX, 
  BookOpen,
  Sun,
  Moon,
  Wifi,
  WifiOff
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';

export default function Navbar({
  isBlackoutMode,
  setIsBlackoutMode,
  theme,
  setTheme,
  isNetworkOnline,
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

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (soundEnabled) playSound('click');
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
      background: 'var(--bg-navbar)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
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
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            color: '#ffffff'
          }}>
            <ShieldAlert size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="resq-brand-text" style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 1.1,
                color: 'var(--text-primary)'
              }}>
                RESQ
              </span>
              <span className="tactical-badge badge-cyan resq-brand-badge">
                CIVIC INTELLIGENCE v2.1
              </span>
            </div>
            <div className="resq-brand-tagline" style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Adaptive Dual-Engine Evacuation & Flood Warning</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <Radio size={12} className="radar-ping" /> {activePeersCount} Mesh Radios Active
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Dual-Mode Switcher */}
        <div className="resq-mode-switcher" style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--tab-bar-bg)',
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
              background: !isBlackoutMode ? 'var(--bg-secondary)' : 'transparent',
              color: !isBlackoutMode ? 'var(--accent-blue)' : 'var(--text-muted)',
              boxShadow: !isBlackoutMode ? 'var(--shadow-card)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            <Cloud size={14} />
            <span className="resq-mode-label-full">Standard Web & Sync Mode</span>
            <span className="resq-mode-label-short">Online Sync</span>
          </button>
          <button
            onClick={() => !isBlackoutMode && toggleMode()}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: isBlackoutMode ? 'var(--accent-red)' : 'transparent',
              color: isBlackoutMode ? '#ffffff' : 'var(--text-muted)',
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
            <span className="resq-mode-label-full">Blackout Mode (100% Zero-Cloud)</span>
            <span className="resq-mode-label-short">Zero-Cloud</span>
          </button>
        </div>

        {/* Right Tools: Theme Toggle, Network Pill, Pitch Deck, Audio, SOS */}
        <div className="resq-nav-tools" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          
          {/* Network Status Pill */}
          <div className="code-pill" style={{
            color: isNetworkOnline ? 'var(--accent-emerald)' : 'var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isNetworkOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isNetworkOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '8px 12px' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
          >
            {theme === 'light' ? (
              <>
                <Moon size={15} color="var(--text-secondary)" />
                <span style={{ fontSize: 11, fontWeight: 700 }}>Dark</span>
              </>
            ) : (
              <>
                <Sun size={15} color="var(--accent-amber)" />
                <span style={{ fontSize: 11, fontWeight: 700 }}>Light</span>
              </>
            )}
          </button>

          {/* Pitch Deck button */}
          <button 
            className="btn-ghost resq-pitchdeck-btn"
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenDeck();
            }}
            title="View Platform Architecture Deck"
          >
            <BookOpen size={15} color="var(--accent-cyan)" />
            <span className="resq-pitchdeck-label">Platform Deck</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="btn-ghost"
            style={{ padding: '8px 10px' }}
            title={soundEnabled ? 'Mute Tactical Audio' : 'Enable Tactical Audio'}
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
            <ShieldAlert size={17} />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
