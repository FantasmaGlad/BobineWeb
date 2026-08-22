// Service Worker pour BobineWeb — Mode Hors-Ligne PWA
const CACHE_NAME = "bobineweb-v1";

const PRECACHE_ASSETS = [
  "/fr",
  "/en",
  "/fr/documentation",
  "/en/documentation",
  "/fr/documentation/demarrage-rapide",
  "/en/documentation/demarrage-rapide",
  "/fr/fonctionnalites",
  "/en/fonctionnalites",
  "/icon.png",
  "/Bobine_icon.png",
  "/manifest.webmanifest",
];

// Installation : mise en cache des pages et ressources essentielles
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch(() => {});
      })
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes réseau (Network-first pour les pages, Cache-first pour les assets statiques)
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorer les requêtes non GET ou externes (sauf assets locaux)
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Ne pas cacher les appels API du chatbot ou github
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Pour les fichiers statiques Next.js (_next/static/), images et polices : Cache First
  if (url.pathname.startsWith("/_next/static/") || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|ico)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Pour les pages HTML / documents : Network First avec fallback sur le cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        // Fallback générique documentation si une page de doc n'est pas encore en cache
        if (url.pathname.includes("/documentation")) {
          const docFallback = await caches.match("/fr/documentation");
          if (docFallback) return docFallback;
        }

        return caches.match("/fr") || Response.error();
      })
  );
});
