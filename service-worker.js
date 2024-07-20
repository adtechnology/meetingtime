const CACHE_NAME = 'meetingtime-cache-v1';
const urlsToCache = [
    '/meetingtime/',
    '/meetingtime/index.html',
    '/meetingtime/static/css/styles.min.css',
    '/meetingtime/static/js/script.min.js',
    '/meetingtime/fonts/Poppins-Regular.ttf',
    '/meetingtime/fonts/Poppins-Bold.ttf'
];

// Cache resources and set expiration
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercept fetch requests and cache with expiration
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            const headers = new Headers(responseToCache.headers);
                            headers.append('sw-cache-expiration', Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
                            const modifiedResponse = new Response(responseToCache.body, {
                                status: responseToCache.status,
                                statusText: responseToCache.statusText,
                                headers: headers
                            });
                            cache.put(event.request, modifiedResponse);
                        });

                    return networkResponse;
                });
            })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Clean up expired cache entries
self.addEventListener('message', event => {
    if (event.data.action === 'clean-up') {
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(keys => {
                keys.forEach(request => {
                    cache.match(request).then(response => {
                        const expirationTime = response.headers.get('sw-cache-expiration');
                        if (Date.now() > expirationTime) {
                            cache.delete(request);
                        }
                    });
                });
            });
        });
    }
});

// Request cache clean-up periodically
setInterval(() => {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ action: 'clean-up' });
        });
    });
}, 24 * 60 * 60 * 1000); // Check once per day
