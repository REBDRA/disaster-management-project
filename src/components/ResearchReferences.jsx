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
    if (name.includes('MAP')) return <Map size={16} color="var(--accent-cyan)" />;
    if (name.includes('TRAFFIC')) return <Car size={16} color="var(--accent-amber)" />;
    if (name.includes('WEATHER')) return <CloudRain size={16} color="#38bdf8" />;
    if (name.includes('DISRUPTION')) return <AlertTriangle size={16} color="var(--accent-red)" />;
    return <Compass size={16} color="var(--accent-emerald)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Research & Data Sources
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          Peer-reviewed mathematical formulations, NASA SRTM models & hydrological standards
        </p>
      </div>

      {/* Research Papers Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
          Foundational Publications
        </div>

        <div className="resq-grid-2col">
          {RESEARCH_PAPERS.map((paper) => (
            <div
              key={paper.id}
              className="resq-card-panel"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span className="tactical-badge badge-cyan" style={{ fontSize: 8 }}>
                    {paper.title}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{paper.journal}</span>
                </div>
                
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>
                  {paper.paperName}
                </div>

                <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  💡 <b>Contribution:</b> {paper.keyTakeaway}
                </div>
              </div>

              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
                style={{ alignSelf: 'flex-start', fontSize: 10, padding: '4px 8px', minHeight: 'unset' }}
              >
                <span>Read Publication</span>
                <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Data Ingestion Pipeline Grid */}
      <div className="resq-card-panel">
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileText size={16} color="var(--accent-emerald)" />
          <span>Integrated Data Feeds & Standards</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 6 }}>
          {DATA_SOURCES_INFO.map((ds, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 8,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {getIcon(ds.category)}
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{ds.category}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-blue)' }}>{ds.source}</div>
              <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0 }}>{ds.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
