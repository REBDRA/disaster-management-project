import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  CheckCircle2, 
  HardDrive, 
  Trash2, 
  Map, 
  RefreshCw,
  CloudOff
} from 'lucide-react';
import { REGIONAL_PACKS } from '../utils/geoRouting';
import { getStoredOfflinePacks, storeOfflinePack, removeOfflinePack, getStorageDiagnostics } from '../utils/offlineManager';
import { playSound } from '../utils/audioEffects';

const EXTENDED_DISTRICT_PACKS = [
  ...REGIONAL_PACKS,
  {
    id: 'kerala-wayanad',
    name: 'Kerala — Wayanad & Periyar Basin',
    state: 'Kerala',
    center: [11.685, 76.132],
    zoom: 13,
    baseRiverElevation: 750,
    sizeMb: 52.4,
    demFormat: 'SRTM 30m GeoPackage (.gpkg)',
    vectorTiles: 'OpenStreetMap Offline PBF',
    status: 'AVAILABLE_DOWNLOAD',
    offlineAvailable: false
  },
  {
    id: 'mumbai-mithi',
    name: 'Maharashtra — Mumbai Mithi Zone',
    state: 'Maharashtra',
    center: [19.060, 72.865],
    zoom: 13,
    baseRiverElevation: 4,
    sizeMb: 49.6,
    demFormat: 'SRTM 30m GeoPackage (.gpkg)',
    vectorTiles: 'OpenStreetMap Offline PBF',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Offline District Packs
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          30m SRTM Digital Elevation Models & offline vector road tiles cached in IndexedDB
        </p>
      </div>

      {/* Storage Diagnostics Card */}
      <div className="resq-stat-card">
        <div className="resq-stat-card-left">
          <span className="resq-stat-label">LOCAL STORAGE DIAGNOSTICS</span>
          <div className="resq-stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {storageInfo.kbUsed} KB
          </div>
          <span className="resq-stat-subtext">
            ✓ Service Worker Cache Operational ({storageInfo.percentEstimated}%)
          </span>
        </div>
        <div className="resq-stat-icon-box" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--accent-emerald)' }}>
          <Database size={20} />
        </div>
      </div>

      {/* District Pack Cards Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {packs.map((pack) => {
          const isCached = pack.status === 'DOWNLOADED_OFFLINE' || pack.status === 'PRE_CACHED_100';
          const isDownloading = downloadingId === pack.id;

          return (
            <div
              key={pack.id}
              className="resq-card-panel"
              style={{
                border: isCached ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {pack.state}
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {pack.name}
                  </div>
                </div>

                {isCached ? (
                  <span className="tactical-badge badge-emerald" style={{ fontSize: 9 }}>
                    <CheckCircle2 size={10} /> 100% CACHED
                  </span>
                ) : (
                  <span className="tactical-badge badge-amber" style={{ fontSize: 9 }}>
                    AVAILABLE
                  </span>
                )}
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Pack Size: <b>{pack.sizeMb} MB</b></span>
                <span>Format: <b>SRTM 30m DEM</b></span>
              </div>

              {isDownloading && (
                <div>
                  <div style={{ width: '100%', height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${downloadProgress}%`, height: '100%', background: 'var(--accent-cyan)' }} />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {isCached ? (
                  <>
                    <button
                      onClick={() => {
                        if (soundEnabled) playSound('click');
                        if (onSelectRegionAndGoToMap) onSelectRegionAndGoToMap(pack.id);
                      }}
                      className="resq-action-btn resq-action-primary"
                      style={{ flex: 1 }}
                    >
                      <Map size={13} />
                      <span>Open in Offline Map</span>
                    </button>
                    <button
                      onClick={() => handlePurge(pack.id)}
                      className="btn-ghost"
                      style={{ padding: '6px 10px', minHeight: 'unset' }}
                      title="Purge"
                    >
                      <Trash2 size={13} color="var(--accent-red)" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDownload(pack)}
                    disabled={isDownloading}
                    className="resq-action-btn resq-action-primary"
                  >
                    <Download size={13} />
                    <span>{isDownloading ? 'Downloading...' : `Download (${pack.sizeMb} MB)`}</span>
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
