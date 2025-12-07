/**
 * Service Worker Migration Utility
 * Migrates users from /service-worker.js to /sw.js
 * This file can be removed after the migration period (4-8 weeks)
 */

export function initServiceWorkerMigration() {
  if (!("serviceWorker" in navigator)) return;

  // Proactively check and migrate on app load
  checkAndMigrate();
}

async function checkAndMigrate() {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const oldRegistration = registrations.find((registration) => {
      const scriptURL =
        registration.active?.scriptURL || registration.installing?.scriptURL;
      return scriptURL && scriptURL.includes("service-worker.js");
    });

    if (oldRegistration) {
      console.log("Found old service worker, triggering migration...");

      // Track migration event if analytics available
      if (typeof gtag !== "undefined") {
        gtag("event", "sw_migration", {
          from: "service-worker.js",
          to: "sw.js",
        });
      }

      await oldRegistration.unregister();
      // The vite-plugin-pwa will automatically register sw.js
      window.location.reload();
    }
  } catch (error) {
    console.error("Service worker migration check failed:", error);
  }
}
