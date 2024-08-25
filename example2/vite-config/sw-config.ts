import { VitePWAOptions } from "vite-plugin-pwa";

const swConfig: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeManifestIcons: true,
  devOptions: {
    enabled: true,
  },
  workbox: {
    // globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //custom scripts to append
    // swDest: 'dist/sw.js',
    // importScripts: ["custom-sw.js"],
    //here you wll add the background sync files
    // additionalManifestEntries: [
    //   {
    //     url:"https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs",
    //     revision:null,
    //   },{
    //     url:"https://img.icons8.com/?size=100&id=s3JOUU9Yp36E&format=png&color=000000",
    //     revision:null
    //   }
    // ],

    //on demand caching
    runtimeCaching: [
      {
        urlPattern: ({ url }) => {
          return url.origin === "https://cdn.jsdelivr.net";
        },
        handler: "CacheFirst", // Serve from cache first, then fetch from network if not found
        options: {
          cacheName: "cdn-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
          backgroundSync: {
            name: "sync-assets", // Unique name for this sync queue
            options: {
              maxRetentionTime: 24 * 60, // Retry for up to 24 hours
            },
          },
        },
      },
      {
        urlPattern: ({ url }) => {
          return url.origin === "https://storage.googleapis.com";
        },
        handler: "CacheFirst", // Serve from cache first, then fetch from network if not found
        options: {
          cacheName: "google-storage-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
          backgroundSync: {
            name: "sync-assets-google", // Unique name for this sync queue
            options: {
              maxRetentionTime: 24 * 60, // Retry for up to 24 hours
            },
          },
        },
      },
    ],
  },
  includeAssets: [
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    // "fonts/*.ttf",
    // "images/*.png",
    // "*/*.svg",
    // "/*.png"
  ],
  // manifest: false,
};

export { swConfig };
