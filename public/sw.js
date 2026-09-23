// RESQ Offline Service Worker
// Enables 100% offline access to evacuation maps, elevation models, and offline packs

const CACHE_NAME = 'resq-offline-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ResQ ServiceWorker] Pre-caching static assets for offline readiness');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ResQ ServiceWorker] Precache failed, will cache on demand:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ResQ ServiceWorker] Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        return cachedResponse;
      }

      // Network fallback with caching of map tiles and assets
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache successful responses for map tiles & static files
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (event.request.url.includes('tile.openstreetmap') ||
             event.request.url.includes('unpkg.com') ||
             event.request.url.includes('.js') ||
             event.request.url.includes('.css') ||
             event.request.url.includes('.png'))
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback if network is completely down
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
