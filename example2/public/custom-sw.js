// // Import Workbox from a CDN or local file
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js",
); // Import Workbox

// // Precache assets
// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// // Example caching strategy
// workbox.routing.registerRoute(
//   ({ url }) => url.origin === 'https://cdn.jsdelivr.net',
//   new workbox.strategies.CacheFirst({
//     cacheName: 'cdn-cache',
//     plugins: [
//       new workbox.expiration.ExpirationPlugin({
//         maxEntries: 10,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
//       }),
//     ],
//   })
// );

// Handle messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "CLEAR_CACHE") {
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      })
      .then(() => {
        // Ensure event.ports is defined and has at least one port
        if (event.ports && event.ports.length > 0) {
          event.ports[0].postMessage({ status: "Cache cleared" });
        } else {
          console.error("No ports available for messaging.");
        }
      })
      .catch((err) => {
        console.error("Failed to clear cache:", err);
      });
  }
});
