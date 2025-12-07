/**
 * Service Worker Migration Utility
 * Migrates users from /service-worker.js to /sw.js
 * This file can be removed after the migration period (4-8 weeks)
 */

export function initServiceWorkerMigration() {
  if (!('serviceWorker' in navigator)) return;

  // Listen for migration messages from old service worker
  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (event.data.type === 'MIGRATE_SW') {
      console.log('Migrating to new service worker:', event.data.newSW);
      
      // Unregister old service worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        if (registration.active?.scriptURL.includes('service-worker.js')) {
          await registration.unregister();
          console.log('Old service worker unregistered');
        }
      }
      
      // Force reload to register new service worker
      window.location.reload();
    }
  });

  // Proactively check and migrate on app load
  checkAndMigrate();
}

async function checkAndMigrate() {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      const scriptURL = registration.active?.scriptURL || registration.installing?.scriptURL;
      
      if (scriptURL && scriptURL.includes('service-worker.js')) {
        console.log('Found old service worker, triggering migration...');
        
        // Track migration event if analytics available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'sw_migration', { 
            from: 'service-worker.js', 
            to: 'sw.js' 
          });
        }
        
        await registration.unregister();
        // The vite-plugin-pwa will automatically register sw.js
        window.location.reload();
        break;
      }
    }
  } catch (error) {
    console.error('Service worker migration check failed:', error);
  }
}
