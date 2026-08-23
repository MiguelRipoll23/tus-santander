export function initServiceWorkerMigration(): void {
  if (!("serviceWorker" in navigator)) return;

  void checkAndMigrate();
}

async function checkAndMigrate(): Promise<void> {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const oldRegistration = registrations.find((registration) => {
      const scriptURL =
        registration.active?.scriptURL ?? registration.installing?.scriptURL;
      return scriptURL?.includes("service-worker.js") === true;
    });

    if (oldRegistration) {
      console.log("Found old service worker, triggering migration...");

      if (typeof gtag !== "undefined") {
        gtag("event", "sw_migration", {
          from: "service-worker.js",
          to: "sw.js",
        });
      }

      await oldRegistration.unregister();
      window.location.reload();
    }
  } catch (error) {
    console.error("Service worker migration check failed:", error);
  }
}
