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
    <header className="resq-navbar">
      <div className="resq-navbar-inner">
        
        {/* Row 1: Brand & Top Tools (Theme Toggle, Deck, Audio, SOS) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 6 }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <ShieldAlert size={18} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: 0.5 }}>
                RESQ
              </span>
              <span className="tactical-badge badge-cyan" style={{ fontSize: 9, padding: '1px 5px' }}>
                v2.1
              </span>
            </div>
          </div>

          {/* Right Tools Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Network Pill */}
            <div className="code-pill" style={{
              color: isNetworkOnline ? 'var(--accent-emerald)' : 'var(--accent-red)',
              fontSize: 9,
              padding: '2px 5px'
            }}>
              {isNetworkOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{ padding: '5px 8px', fontSize: 11, minHeight: 'unset' }}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} color="var(--accent-amber)" />}
            </button>

            {/* Deck Modal Trigger */}
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                onOpenDeck();
              }}
              className="btn-ghost"
              style={{ padding: '5px 8px', minHeight: 'unset' }}
              title="Pitch Deck"
            >
              <BookOpen size={13} color="var(--accent-cyan)" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="btn-ghost"
              style={{ padding: '5px 7px', minHeight: 'unset' }}
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 size={13} color="var(--accent-emerald)" /> : <VolumeX size={13} color="var(--text-muted)" />}
            </button>

            {/* SOS Button */}
            <button
              onClick={() => {
                if (soundEnabled) playSound('sos');
                onOpenSos();
              }}
              className="btn-sos"
              style={{ padding: '5px 10px', fontSize: 11, minHeight: 'unset' }}
            >
              <ShieldAlert size={13} />
              <span>SOS</span>
            </button>
          </div>

        </div>

        {/* Row 2: Tactical Mode Switcher (Full Width 2-Segment Control) */}
        <div style={{
          display: 'flex',
          width: '100%',
          background: 'var(--tab-bar-bg)',
          padding: '2px',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          marginTop: 2
        }}>
          <button
            onClick={() => isBlackoutMode && toggleMode()}
            style={{
              flex: 1,
              padding: '5px 8px',
              borderRadius: 6,
              border: 'none',
              background: !isBlackoutMode ? 'var(--bg-card)' : 'transparent',
              color: !isBlackoutMode ? 'var(--accent-blue)' : 'var(--text-muted)',
              boxShadow: !isBlackoutMode ? 'var(--shadow-card)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              minHeight: 'unset'
            }}
          >
            <Cloud size={12} />
            <span>Online Sync</span>
          </button>

          <button
            onClick={() => !isBlackoutMode && toggleMode()}
            style={{
              flex: 1,
              padding: '5px 8px',
              borderRadius: 6,
              border: 'none',
              background: isBlackoutMode ? 'var(--accent-red)' : 'transparent',
              color: isBlackoutMode ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              minHeight: 'unset'
            }}
          >
            <CloudOff size={12} />
            <span>Zero-Cloud</span>
          </button>
        </div>

      </div>
    </header>
  );
}
