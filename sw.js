// Keeps the ELT DF plotter page itself available offline. Map tiles are stored separately by the page.
const CACHE = 'eltdf-shell-v1';
const SHELL = ['./', './elt-df-plotter.html', './sw.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // tiles and other sites go straight to the network
  e.respondWith(
    fetch(e.request).then(resp => { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return resp; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./elt-df-plotter.html')))
  );
});
