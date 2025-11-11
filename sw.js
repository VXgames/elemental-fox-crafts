/**
 * Service Worker for Elemental Fox Crafts
 * Provides offline support, caching, and background sync
 */

const CACHE_NAME = 'elemental-fox-crafts-v1';
const OFFLINE_PAGE = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/shop.html',
  '/offline.html',
  '/style.css',
  '/assets/js/performance-optimizer.js',
  '/assets/js/security.js',
  '/assets/js/accessibility.js',
  '/assets/js/error-handler.js',
  '/assets/js/toast-messages.js',
  '/assets/js/menu.js',
  '/assets/js/cart.js',
  '/assets/Logo/VectorFoxwhite.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim(); // Take control of all pages
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for same-origin)
  if (url.origin !== location.origin) {
    // Allow caching of external resources we control (Google Fonts, etc.)
    if (url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.match(request).then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            // Cache fonts for offline use
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return fetchResponse;
          });
        })
      );
    }
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache, show offline page
            return caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }

  // Handle other requests (CSS, JS, images, JSON)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          })
          .catch((error) => {
            // Network failed and not in cache
            console.log('[Service Worker] Fetch failed for:', request.url, error);
            
            // For images, return a placeholder SVG
            if (request.destination === 'image' || request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#f0f0f0" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif" font-size="14">Image not available</text></svg>',
                { 
                  headers: { 
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                  } 
                }
              );
            }
            
            // For JSON files, return empty object
            if (request.url.match(/\.json$/i)) {
              return new Response('{}', {
                headers: { 
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache'
                }
              });
            }
            
            // For other resources, return empty response
            return new Response('', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache'
              }
            });
          });
      })
  );
});

// Background Sync - sync cart/orders when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'sync-order') {
    event.waitUntil(syncOrder());
  }
});

// Sync cart data
async function syncCart() {
  try {
    // Get pending cart updates from IndexedDB or localStorage
    const pendingCart = await getPendingCartSync();
    if (!pendingCart || pendingCart.length === 0) {
      console.log('[Service Worker] No pending cart sync');
      return;
    }

    // In a real app, you would send this to your server
    // For now, we'll just mark it as synced
    console.log('[Service Worker] Syncing cart:', pendingCart);
    
    // Clear pending sync after successful sync
    await clearPendingCartSync();
    
    // Notify clients that sync completed
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CART_SYNCED',
        data: pendingCart
      });
    });
  } catch (error) {
    console.error('[Service Worker] Cart sync failed:', error);
    throw error; // Retry sync
  }
}

// Sync order data
async function syncOrder() {
  try {
    const pendingOrder = await getPendingOrderSync();
    if (!pendingOrder) {
      console.log('[Service Worker] No pending order sync');
      return;
    }

    // In a real app, you would send this to your server
    console.log('[Service Worker] Syncing order:', pendingOrder);
    
    // Clear pending sync after successful sync
    await clearPendingOrderSync();
    
    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'ORDER_SYNCED',
        data: pendingOrder
      });
    });
  } catch (error) {
    console.error('[Service Worker] Order sync failed:', error);
    throw error; // Retry sync
  }
}

// Helper functions for IndexedDB (using localStorage as fallback)
async function getPendingCartSync() {
  try {
    const pending = localStorage.getItem('pending_cart_sync');
    return pending ? JSON.parse(pending) : null;
  } catch (error) {
    console.error('[Service Worker] Error getting pending cart sync:', error);
    return null;
  }
}

async function clearPendingCartSync() {
  try {
    localStorage.removeItem('pending_cart_sync');
  } catch (error) {
    console.error('[Service Worker] Error clearing pending cart sync:', error);
  }
}

async function getPendingOrderSync() {
  try {
    const pending = localStorage.getItem('pending_order_sync');
    return pending ? JSON.parse(pending) : null;
  } catch (error) {
    console.error('[Service Worker] Error getting pending order sync:', error);
    return null;
  }
}

async function clearPendingOrderSync() {
  try {
    localStorage.removeItem('pending_order_sync');
  } catch (error) {
    console.error('[Service Worker] Error clearing pending order sync:', error);
  }
}

// Message handler for communication with clients
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    // Cache additional URLs on demand
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

