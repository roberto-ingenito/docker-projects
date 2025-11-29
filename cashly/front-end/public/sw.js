// public/sw.js

// Nome del cache, utile per versionare
const CACHE_NAME = 'nextjs-pwa-v1';

// Lista di asset che si desidera pre-caching
// In una vera PWA, questi verrebbero generati automaticamente da Workbox.
// Qui, è solo un esempio per mostrare la struttura.
const urlsToCache = ['/cashly/'];

// --- 1. Installazione del Service Worker ---
self.addEventListener('install', (event) => {
    // L'evento 'install' è chiamato quando il Service Worker viene installato.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('Opened cache');
                // Aggiunge tutte le risorse da 'urlsToCache' alla cache
                try {
                    return await cache.addAll(urlsToCache);
                } catch (err) {
                    console.error('Failed to pre-cache assets:', err);
                }
            })
            .then(() => self.skipWaiting()) // Forza l'attivazione immediata
    );
});

// --- 2. Attivazione del Service Worker ---
self.addEventListener('activate', (event) => {
    // L'evento 'activate' è chiamato quando il Service Worker si attiva.
    event.waitUntil(
        // Elimina vecchie cache
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Assicura che i client esistenti prendano il controllo
    );
});

// --- 3. Intercettazione delle richieste (Fetching) ---
self.addEventListener('fetch', (event) => {
    // Intercetta tutte le richieste HTTP uscenti.
    // Qui implementeresti la strategia di caching.

    // Strategia Esempio: Cache first, then network (per risorse statiche)
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Ritorna la risorsa dalla cache se presente
                if (response) {
                    return response;
                }

                // Altrimenti, va al network
                return fetch(event.request).then((networkResponse) => {
                    // Opzionalmente, clona la risposta e la aggiunge alla cache
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Non cacha richieste POST o quelle che non sono HTTP/HTTPS
                            if (event.request.method === 'GET' && networkResponse.status === 200) {
                                // **Attenzione:** La cache delle richieste di navigazione di Next.js
                                // può essere complessa e richiedere Workbox.
                                cache.put(event.request, responseToCache);
                            }
                        });
                    return networkResponse;
                });
            })
            .catch(() => {
                // Questo catch è chiamato se la fetch fallisce (es. offline)
                // Qui potresti servire una pagina di fallback 'offline.html'
                console.log('Fetch failed, serving offline page if available.');
                // return caches.match('/offline.html');
            })
    );
});