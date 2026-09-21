import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Map, 
  Car, 
  CloudRain, 
  AlertTriangle, 
  Compass
} from 'lucide-react';
import { RESEARCH_PAPERS, DATA_SOURCES_INFO } from '../utils/researchData';

export default function ResearchReferences() {
  const getIcon = (name) => {
    if (name.includes('MAP')) return <Map size={20} color="var(--accent-cyan)" />;
    if (name.includes('TRAFFIC')) return <Car size={20} color="var(--accent-amber)" />;
    if (name.includes('WEATHER')) return <CloudRain size={20} color="#38bdf8" />;
    if (name.includes('DISRUPTION')) return <AlertTriangle size={20} color="#ff2a5f" />;
    return <Compass size={20} color="var(--accent-emerald)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Section: Research Foundations */}
      <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={22} color="var(--accent-cyan)" />
              <span>RESEARCH FOUNDATIONS & PEER-REVIEWED REFERENCES</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              The mathematical algorithms in RESQ are founded on published stochastic routing and emergency traffic research.
            </div>
          </div>
          <span className="code-pill">SLIDE 6 VALIDATED</span>
        </div>

        <div className="resq-research-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {RESEARCH_PAPERS.map((paper) => (
            <div
              key={paper.id}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="tactical-badge badge-cyan" style={{ fontSize: 9 }}>
                    {paper.title}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paper.journal}</span>
                </div>
                
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 8 }}>
                  {paper.paperName}
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
                  💡 <b>Contribution to ResQ:</b> {paper.keyTakeaway}
                </div>
              </div>

              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
                style={{ alignSelf: 'flex-start', fontSize: 11, padding: '6px 12px' }}
              >
                <span>Read Publication</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: The 5 Data Sources */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={20} color="var(--accent-emerald)" />
          <span>DATA SOURCES & INGESTION PIPELINE</span>
        </div>

        <div className="resq-datasources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {DATA_SOURCES_INFO.map((ds, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 14,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                {getIcon(ds.name)}
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', letterSpacing: 0.5 }}>
                {ds.name}
              </div>

              <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {ds.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
