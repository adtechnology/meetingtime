const CACHE_NAME = 'meetingtime-cache-v1';
const urlsToCache = [
    '/meetingtime/',
    '/meetingtime/index.html',
    '/meetingtime/static/css/styles.min.css',
    '/meetingtime/static/js/script.min.js',
    '/meetingtime/fonts/Poppins-Regular.ttf',
    '/meetingtime/fonts/Poppins-Bold.ttf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

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
