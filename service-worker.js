const cacheName = "ginkobus-cache-v1";
const contentToCache = [
    "./index.html",
    "./app.js",
    "./ginko.webmanifest",
    "./icons/favicon.ico",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/maskable_icon.png"
]

self.addEventListener("install", (e) => {
    console.log("[Service Worker] Install");
    e.waitUntil(
      (async () => {
        const cache = await caches.open(cacheName);
        console.log("[Service Worker] Caching all: app shell and content");
        await cache.addAll(contentToCache);
      })(),
    );
  });

  self.addEventListener("fetch", (e) => {
    if(!e.request.url.startsWith("http")){return ;}
    e.respondWith(
      (async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
          return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
      })(),
    );
  });
  
  