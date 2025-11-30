// public/cashly/sw.js

// Nota: il nome della cache non è strettamente necessario qui,
// ma è una buona pratica tenerlo per futuri sviluppi.
const CACHE_NAME = 'nextjs-pwa-stub-v1';

// --- 1. Installazione del Service Worker ---
self.addEventListener('install', (event) => {
    // Si installa immediatamente, senza fare pre-caching
    console.log('Service Worker: Installing...');
    event.waitUntil(self.skipWaiting()); // Forza l'attivazione immediata
});

// --- 2. Attivazione del Service Worker ---
self.addEventListener('activate', (event) => {
    // Pulisce eventuali vecchie cache (buona pratica)
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
            .then(() => self.clients.claim()) // Assicura che i client esistenti prendano il controllo
    );
});

// --- 3. NESSUN EVENTO 'fetch' ---
// Eliminando l'addEventListener('fetch', ...), il Service Worker non
// intercetta più le richieste di rete, bypassando l'errore di reindirizzamento 301.

console.log('Service Worker: Running (Stub Mode)');