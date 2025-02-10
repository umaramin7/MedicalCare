// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('emergency-portal-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/emergency-portal.html',
                '/emergency-portal.js',
                // Add other resources you want to cache
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});