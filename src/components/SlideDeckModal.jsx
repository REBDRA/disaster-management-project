import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ExternalLink,
  ShieldAlert,
  CloudOff,
  Radio,
  Layers,
  Zap,
  Users,
  Building2,
  Waves,
  MapPin,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';
import { RESEARCH_PAPERS, DATA_SOURCES_INFO } from '../utils/researchData';

export default function SlideDeckModal({ isOpen, onClose, soundEnabled }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    // SLIDE 1: Problem Statement & Theme
    {
      id: 1,
      tag: 'SLIDE 1',
      title: 'SMART EVACUATION ROUTE PLANNING USING REAL-TIME CONDITIONS',
      subtitle: 'Problem Statement Title • Disaster Management Hackathon Presentation',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 14,
            padding: 24,
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 20, background: 'rgba(2, 132, 199, 0.15)', border: '1px solid var(--border-cyan)', marginBottom: 12 }}>
              <ShieldAlert size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: 1 }}>RESQ CORE INITIATIVE</span>
            </div>
            
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 0.5, marginBottom: 8 }}>
              RESQ — ADAPTIVE DUAL-ENGINE EVACUATION & AI FLOOD WARNING
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
              A high-reliability disaster management platform that runs 100% offline during telecommunication blackouts via on-device SRTM 30m elevation routing, predictive 48-hour flood surge modeling, and ad-hoc radio mesh packet forwarding.
            </p>
          </div>

          <div className="resq-deck-slide1-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>THEME</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-red)', marginTop: 6 }}>DISASTER MANAGEMENT</div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>KEY PILLARS</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)', marginTop: 6 }}>Elevation Routing + AI Flood Forecast</div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>ARCHITECTURE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-emerald)', marginTop: 6 }}>100% Offline PWA & Service Worker</div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>TARGET GEOGRAPHIES</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 6 }}>Assam, Bihar, Bengal, Kerala</div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: Solution Architecture & Novelty
    {
      id: 2,
      tag: 'SLIDE 2',
      title: 'SOLUTIONS & SYSTEM ARCHITECTURE',
      subtitle: 'How ResQ solves zero-telecom flood evacuation and early warning',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Waves size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>48h Inundation Forecast Engine</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Dynamic hydrological simulation integrating CWC river gauges, rainfall radar, and soil saturation to project hour-by-hour floodwater crests and breach ETAs.
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <HardDrive size={18} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>On-Device Offline Routing</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Pre-cached SRTM 30m Digital Elevation Models (DEM) running in-browser Dijkstra algorithms that calculate the highest, safest path to high-ground shelters without internet.
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Building2 size={18} color="var(--accent-blue)" />
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Direct Relief Treasury</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Transparent state relief escrow (SDRF/PMNRF), direct citizen aid disbursement tracking, and field logistics inventory monitoring.
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>RESEARCH CITATIONS & BENCHMARKS:</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="code-pill">CWC Hydrology Guidelines</span>
              <span className="code-pill">NASA SRTM 30m DEM</span>
              <span className="code-pill">NDRF Standard Operating Procedures</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handlePrev = () => {
    if (soundEnabled) playSound('click');
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (soundEnabled) playSound('click');
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  };

  const current = slides[currentSlide];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      background: 'rgba(5, 8, 15, 0.8)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 960,
        maxHeight: '92vh',
        overflowY: 'auto',
        border: '1px solid var(--border-cyan)',
        boxShadow: 'var(--shadow-float)',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="tactical-badge badge-cyan">{current.tag}</span>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {current.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px 10px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Slide Body */}
        <div style={{ flex: 1, minHeight: 340 }}>
          {current.content}
        </div>

        {/* Slide Navigation Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="btn-ghost"
            style={{ opacity: currentSlide === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Slide {currentSlide + 1} of {slides.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="btn-ghost"
            style={{ opacity: currentSlide === slides.length - 1 ? 0.4 : 1 }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
