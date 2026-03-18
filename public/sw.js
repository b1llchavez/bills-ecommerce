/*
  Service Worker (sw.js)

  - Purpose: provides basic offline caching for the PWA.
  - Note: keep this file compatible with the browser's service worker
    lifecycle (install, activate, fetch). Do not add blocking logic
    or synchronous code here.
*/

// Cache name/version. Bump this value when you want clients to use a
// new cache (simple cache invalidation strategy).
const CACHE_NAME = 'shophub-cache-v1';

// Core URLs to cache during the install step so the app can load offline.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install: open the cache and store core assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // `addAll` fetches and caches the listed resources
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch: try cache first, then network. If both fail (offline),
// fall back to the root page from cache. This pattern is simple and
// works well for basic static PWAs.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we have a cached response, return it immediately.
        if (response) {
          return response;
        }
        // Otherwise, attempt a network fetch. If that fails (offline),
        // return the cached root page as a graceful fallback.
        return fetch(event.request).catch(() => {
            return caches.match('/');
        });
      })
  );
});

// Activate: remove any old caches not present in the whitelist.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete outdated cache entries
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});