const CACHE_NAME = 'kane-control-room-pro-v3-nav-2026-07-02';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './badge-72.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // HTML should prefer network first so GitHub Pages updates show quickly.
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
      return response;
    }))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
      return undefined;
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = { title: 'HTB Control Room', body: 'Open your routine and execute the next action.' };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    if (event.data) payload.body = event.data.text();
  }
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: './icon-192.png',
    badge: './badge-72.png',
    tag: payload.tag || 'htb-control-room',
    data: payload.url || './'
  }));
});
