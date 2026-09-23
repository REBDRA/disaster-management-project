import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  CheckCircle2, 
  HardDrive, 
  Trash2, 
  ShieldCheck, 
  Map, 
  Layers, 
  CloudOff, 
  Sparkles,
  RefreshCw,
  FolderDown,
  Info
} from 'lucide-react';
import { REGIONAL_PACKS } from '../utils/geoRouting';
import { getStoredOfflinePacks, storeOfflinePack, removeOfflinePack, getStorageDiagnostics } from '../utils/offlineManager';
import { playSound } from '../utils/audioEffects';

const EXTENDED_DISTRICT_PACKS = [
  ...REGIONAL_PACKS,
  {
    id: 'kerala-wayanad',
    name: 'Kerala — Wayanad Landslide & Periyar Basin',
    state: 'Kerala',
    center: [11.685, 76.132],
    zoom: 13,
    baseRiverElevation: 750,
    sizeMb: 52.4,
    demFormat: 'SRTM 30m GeoPackage (.gpkg)',
    vectorTiles: 'OpenStreetMap Offline PBF (SQLite)',
    status: 'AVAILABLE_DOWNLOAD',
    offlineAvailable: false
  },
  {
    id: 'mumbai-mithi',
    name: 'Maharashtra — Mumbai Mithi River Coastal Zone',
    state: 'Maharashtra',
    center: [19.060, 72.865],
    zoom: 13,
    baseRiverElevation: 4,
    sizeMb: 49.6,
    demFormat: 'SRTM 30m GeoPackage (.gpkg)',
    vectorTiles: 'OpenStreetMap Offline PBF (SQLite)',
    status: 'AVAILABLE_DOWNLOAD',
    offlineAvailable: false
  }
];

export default function OfflineDistrictPacks({ soundEnabled, onSelectRegionAndGoToMap }) {
  const [packs, setPacks] = useState(EXTENDED_DISTRICT_PACKS);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [storageInfo, setStorageInfo] = useState({ kbUsed: '124.5', mbUsed: '0.12', percentEstimated: '2.4' });

  useEffect(() => {
    refreshCacheState();
  }, []);

  const refreshCacheState = () => {
    const stored = getStoredOfflinePacks();
    setPacks(prev => prev.map(p => {
      if (stored[p.id] || p.status === 'PRE_CACHED_100') {
        return { ...p, status: 'DOWNLOADED_OFFLINE', offlineAvailable: true };
      }
      return p;
    }));
    setStorageInfo(getStorageDiagnostics());
  };

  const handleDownload = (pack) => {
    if (soundEnabled) playSound('click');
    setDownloadingId(pack.id);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            storeOfflinePack(pack.id, pack);
            setDownloadingId(null);
            setDownloadProgress(0);
            refreshCacheState();
            if (soundEnabled) playSound('success');
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handlePurge = (packId) => {
    if (soundEnabled) playSound('click');
    removeOfflinePack(packId);
    refreshCacheState();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <HardDrive size={20} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              Offline District Map & High-Res Elevation Packs
            </h1>
            <span className="tactical-badge badge-cyan">
              ZERO INTERNET READY
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Pre-cache 30-meter SRTM elevation models and offline road network vector tiles directly in browser storage (IndexedDB).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="code-pill">
            <Database size={13} /> {storageInfo.kbUsed} KB CACHED
          </div>
          <button
            onClick={refreshCacheState}
            className="btn-ghost"
            style={{ padding: '8px 12px' }}
            title="Refresh Storage Status"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Offline Storage Status Card */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloudOff size={18} color="var(--accent-cyan)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              Device Local Storage Diagnostics
            </span>
          </div>
          <span className="tactical-badge badge-emerald">
            <CheckCircle2 size={12} /> SERVICE WORKER CACHE ACTIVE
          </span>
        </div>

        <div style={{ width: '100%', height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{
            width: `${Math.max(5, storageInfo.percentEstimated)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))',
            borderRadius: 4
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Storage Utilized: {storageInfo.kbUsed} KB ({storageInfo.percentEstimated}%)</span>
          <span>IndexedDB Quota Available: ~500 MB</span>
        </div>
      </div>

      {/* District Pack Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
        {packs.map((pack) => {
          const isCached = pack.status === 'DOWNLOADED_OFFLINE' || pack.status === 'PRE_CACHED_100';
          const isDownloading = downloadingId === pack.id;

          return (
            <div
              key={pack.id}
              className="glass-panel"
              style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCached ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {pack.state}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0 0' }}>
                      {pack.name}
                    </h3>
                  </div>
                  {isCached ? (
                    <span className="tactical-badge badge-emerald">
                      <CheckCircle2 size={11} /> 100% CACHED
                    </span>
                  ) : (
                    <span className="tactical-badge badge-amber">
                      AVAILABLE
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '14px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Elevation Model:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pack.demFormat}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Vector Road Network:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pack.vectorTiles}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Estimated Pack Size:</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{pack.sizeMb} MB</span>
                  </div>
                </div>

                {isDownloading && (
                  <div style={{ margin: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span>Downloading DEM Contours & Road Tiles...</span>
                      <span style={{ fontWeight: 700 }}>{downloadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${downloadProgress}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.2s ease' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {isCached ? (
                  <>
                    <button
                      onClick={() => {
                        if (soundEnabled) playSound('click');
                        if (onSelectRegionAndGoToMap) onSelectRegionAndGoToMap(pack.id);
                      }}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '9px 12px' }}
                    >
                      <Map size={14} />
                      <span>Open in Offline Map</span>
                    </button>
                    <button
                      onClick={() => handlePurge(pack.id)}
                      className="btn-ghost"
                      style={{ padding: '9px 12px' }}
                      title="Purge from Cache"
                    >
                      <Trash2 size={14} color="var(--accent-red)" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDownload(pack)}
                    disabled={isDownloading}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '9px 12px' }}
                  >
                    <Download size={14} />
                    <span>{isDownloading ? 'Caching Data...' : `Download Pack (${pack.sizeMb} MB)`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
