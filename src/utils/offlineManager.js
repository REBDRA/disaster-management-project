// RESQ Web2 Offline Storage & Sync Engine
// Manages LocalStorage & IndexedDB storage for zero-connectivity emergency scenarios

const OFFLINE_STORAGE_KEYS = {
  PACKS: 'resq_offline_packs_v2',
  QUEUED_SOS: 'resq_queued_sos_v2',
  OFFLINE_HAZARDS: 'resq_offline_hazards_v2',
  RELIEF_APPLICATIONS: 'resq_relief_applications_v2',
  USER_SETTINGS: 'resq_user_settings_v2'
};

// Check if browser has active internet connection
export function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Get all downloaded district packs
export function getStoredOfflinePacks() {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEYS.PACKS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save or update an offline pack status
export function storeOfflinePack(packId, packData) {
  try {
    const packs = getStoredOfflinePacks();
    packs[packId] = {
      ...packData,
      downloadedAt: new Date().toISOString(),
      status: 'DOWNLOADED_OFFLINE'
    };
    localStorage.setItem(OFFLINE_STORAGE_KEYS.PACKS, JSON.stringify(packs));
    return true;
  } catch (err) {
    console.error('Failed to store offline pack:', err);
    return false;
  }
}

// Remove an offline pack from local cache
export function removeOfflinePack(packId) {
  try {
    const packs = getStoredOfflinePacks();
    delete packs[packId];
    localStorage.setItem(OFFLINE_STORAGE_KEYS.PACKS, JSON.stringify(packs));
    return true;
  } catch {
    return false;
  }
}

// Enqueue an SOS when device is offline
export function queueOfflineSOS(sosPayload) {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEYS.QUEUED_SOS);
    const list = raw ? JSON.parse(raw) : [];
    const item = {
      ...sosPayload,
      queuedAt: new Date().toISOString(),
      offlineId: `offline-sos-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    list.push(item);
    localStorage.setItem(OFFLINE_STORAGE_KEYS.QUEUED_SOS, JSON.stringify(list));
    return item;
  } catch {
    return null;
  }
}

// Get queued SOS messages
export function getQueuedSOS() {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEYS.QUEUED_SOS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Clear queued SOS messages once synced to server
export function clearQueuedSOS() {
  try {
    localStorage.removeItem(OFFLINE_STORAGE_KEYS.QUEUED_SOS);
  } catch (err) {
    console.warn(err);
  }
}

// Enqueue an offline hazard report
export function queueOfflineHazard(hazard) {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEYS.OFFLINE_HAZARDS);
    const list = raw ? JSON.parse(raw) : [];
    const item = {
      ...hazard,
      reportedAt: new Date().toISOString(),
      offlineId: `off-haz-${Date.now()}`
    };
    list.unshift(item);
    localStorage.setItem(OFFLINE_STORAGE_KEYS.OFFLINE_HAZARDS, JSON.stringify(list));
    return item;
  } catch {
    return null;
  }
}

export function getOfflineHazards() {
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEYS.OFFLINE_HAZARDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Estimate storage used by ResQ local storage
export function getStorageDiagnostics() {
  let totalBytes = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
  } catch (err) {
    console.warn(err);
  }
  const kbUsed = (totalBytes / 1024).toFixed(1);
  return {
    bytesUsed: totalBytes,
    kbUsed,
    mbUsed: (totalBytes / (1024 * 1024)).toFixed(2),
    percentEstimated: Math.min(100, ((totalBytes / (5 * 1024 * 1024)) * 100).toFixed(1))
  };
}

// Register service worker helper
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[ResQ PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[ResQ PWA] Service Worker registration failed (normal in dev sandbox):', err);
        });
    });
  }
}
