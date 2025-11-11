/**
 * PWA Installation and Service Worker Registration
 */

(function() {
  'use strict';

  let deferredPrompt;
  let installButton = null;

  // Register service worker
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              console.log('[PWA] New service worker found');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('[PWA] New service worker installed, reload to update');
                  if (window.showInfo) {
                    window.showInfo('New version available! Reload the page to update.', 5000);
                  }
                }
              });
            });

            // Handle service worker updates
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              if (!refreshing) {
                refreshing = true;
                console.log('[PWA] Service worker updated, reloading...');
                window.location.reload();
              }
            });
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
            if (window.ErrorHandler) {
              window.ErrorHandler.handle(error, 'pwa_sw_registration', {
                showToUser: false,
                severity: window.ErrorHandler.ERROR_SEVERITY.LOW
              });
            }
          });
      });
    } else {
      console.warn('[PWA] Service Workers are not supported in this browser');
    }
  }

  // Handle install prompt
  function handleInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] Install prompt available');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show install button if it exists
      showInstallButton();
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      deferredPrompt = null;
      hideInstallButton();
      
      if (window.showSuccess) {
        window.showSuccess('App installed successfully!');
      }
    });
  }

  // Show install button
  function showInstallButton() {
    // Create install button if it doesn't exist
    if (!installButton) {
      installButton = document.createElement('button');
      installButton.id = 'pwa-install-button';
      installButton.className = 'pwa-install-button';
      installButton.innerHTML = '📱 Install App';
      installButton.setAttribute('aria-label', 'Install Elemental Fox Crafts app');
      installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 0.75rem 1.5rem;
        background: #bcb893;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: all 0.3s;
      `;
      
      installButton.addEventListener('mouseenter', () => {
        installButton.style.background = '#a8a67f';
        installButton.style.transform = 'translateY(-2px)';
      });
      
      installButton.addEventListener('mouseleave', () => {
        installButton.style.background = '#bcb893';
        installButton.style.transform = 'translateY(0)';
      });
      
      installButton.addEventListener('click', installApp);
      document.body.appendChild(installButton);
    }
    
    installButton.style.display = 'block';
  }

  // Hide install button
  function hideInstallButton() {
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  // Install app
  async function installApp() {
    if (!deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User choice:', outcome);
    
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    deferredPrompt = null;
    hideInstallButton();
  }

  // Background sync helper
  function registerBackgroundSync(tag, data) {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Store data for sync
        if (tag === 'sync-cart') {
          localStorage.setItem('pending_cart_sync', JSON.stringify(data));
        } else if (tag === 'sync-order') {
          localStorage.setItem('pending_order_sync', JSON.stringify(data));
        }
        
        return registration.sync.register(tag);
      })
      .then(() => {
        console.log('[PWA] Background sync registered:', tag);
      })
      .catch((error) => {
        console.error('[PWA] Background sync registration failed:', error);
      });
    } else {
      console.warn('[PWA] Background sync not supported');
    }
  }

  // Listen for sync completion messages from service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CART_SYNCED') {
        console.log('[PWA] Cart synced:', event.data.data);
        if (window.showSuccess) {
          window.showSuccess('Cart synced successfully!');
        }
      } else if (event.data && event.data.type === 'ORDER_SYNCED') {
        console.log('[PWA] Order synced:', event.data.data);
        if (window.showSuccess) {
          window.showSuccess('Order synced successfully!');
        }
      }
    });
  }

  // Initialize
  registerServiceWorker();
  handleInstallPrompt();

  // Expose to global scope
  window.PWA = {
    installApp: installApp,
    registerBackgroundSync: registerBackgroundSync,
    showInstallButton: showInstallButton,
    hideInstallButton: hideInstallButton
  };

})();

