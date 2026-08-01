/* প্রথম খাবার — service worker
 *
 * Makes the app work with no internet connection and, on iOS, stops Safari
 * evicting the caregiver's saved data after a period of not opening the site.
 *
 * Strategy:
 *   - App shell (HTML, icons, manifest): cached on install, served
 *     network-first so a fresh deploy is picked up when online, falling back
 *     to cache when offline.
 *   - Google Fonts: cache-first, since they never change and are the only
 *     third-party request in the app.
 *
 * IMPORTANT: bump CACHE_VERSION whenever you publish a new index.html,
 * otherwise returning visitors keep seeing the cached copy.
 */
const CACHE_VERSION = 'pk-v2.0.0';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

/* Install: pre-cache the shell. Individual failures are tolerated so one
   missing optional file cannot break the whole installation. */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.all(
        SHELL.map(url => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

/* Activate: drop caches from previous versions. */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isFont = url.hostname.indexOf('fonts.googleapis.com') > -1 ||
                 url.hostname.indexOf('fonts.gstatic.com') > -1;

  /* Fonts: cache-first. */
  if (isFont) {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
    return;
  }

  /* Same-origin: network-first, falling back to cache when offline. */
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() =>
        caches.match(req).then(hit => hit || caches.match('./index.html'))
      )
    );
  }
});
