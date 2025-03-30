self.addEventListener("install", () => {
  // Skip waiting to immediately activate the service worker
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Perform cache cleanup and other necessary tasks
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName); // Delete all caches
          })
        );
      })
      .then(() => {
        // Unregister the service worker
        return self.registration.unregister();
      })
      .catch((error) => {
        console.error("Error during cache clearing or unregistering:", error);
      })
  );
});
