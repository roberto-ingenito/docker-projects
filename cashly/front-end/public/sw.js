// public/sw.js
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('static-v1').then(cache =>
            cache.addAll(['/cashly/'])
        )
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(resp => resp || fetch(event.request))
    )
})
