import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*\/*/, // This will match all requests
            handler: "NetworkFirstNetworkFirst", // Cache First strategy
            options: {
              cacheName: "my-cache", // Cache name for all assets
              expiration: {
                maxEntries: 100, // Limit the cache size to 100 items
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache expiration (1 week)
              },
            },
          },
        ],
      },
      manifest: {
        name: "Simple Vite PWA",
        short_name: "VitePWA",
        description: "A simple Progressive Web App using Vite",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
