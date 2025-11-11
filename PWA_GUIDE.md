# Progressive Web App (PWA) Implementation Guide

## Overview

The Elemental Fox Crafts website has been enhanced with Progressive Web App (PWA) features, making it installable and functional offline.

## Features Implemented

### 1. Service Worker (`sw.js`)
- **Offline Support**: Caches static assets and pages for offline access
- **Cache Strategy**: Network-first with cache fallback for navigation, cache-first for static assets
- **Auto-update**: Automatically updates when new service worker is available
- **Background Sync**: Syncs cart and orders when connection is restored

### 2. Web App Manifest (`manifest.json`)
- **Installable**: Makes the app installable on mobile and desktop devices
- **App-like Experience**: Runs in standalone mode (no browser UI)
- **Icons**: Uses logo for app icons (192x192 and 512x512)
- **Theme Colors**: Matches website color scheme (#bcb893)
- **Shortcuts**: Quick access to Shop and Cart pages

### 3. Offline Page (`offline.html`)
- **User-friendly**: Shows a helpful message when offline
- **Auto-retry**: Automatically checks for connection restoration
- **Status Indicator**: Shows current connection status

### 4. Background Sync
- **Cart Sync**: Automatically syncs cart changes when connection is restored
- **Order Sync**: Syncs completed orders when connection is restored
- **Automatic**: Works in the background without user intervention

## Installation

### For Users

1. **Mobile (Android/Chrome)**:
   - Visit the website
   - Tap the menu (three dots) in the browser
   - Select "Install app" or "Add to Home Screen"
   - Or tap the install button that appears

2. **Desktop (Chrome/Edge)**:
   - Visit the website
   - Click the install icon in the address bar
   - Or click the install button in the bottom-right corner

3. **iOS (Safari)**:
   - Visit the website
   - Tap the Share button
   - Select "Add to Home Screen"

### For Developers

The PWA features are automatically enabled. The service worker registers on page load, and the manifest is linked in all HTML files.

## Testing

### Test Service Worker
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Check "Service Workers" section
4. Verify service worker is registered and active

### Test Offline Mode
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Refresh the page
5. Verify offline page appears or cached content loads

### Test Installation
1. Visit the website
2. Look for install prompt or button
3. Install the app
4. Verify it opens in standalone mode

### Test Background Sync
1. Go offline
2. Add items to cart or complete an order
3. Go back online
4. Verify sync happens automatically (check console logs)

## Cache Management

### Cache Version
The cache version is defined in `sw.js`:
```javascript
const CACHE_NAME = 'elemental-fox-crafts-v1';
```

### Updating Cache
To update the cache:
1. Increment the version number in `sw.js`
2. Update `STATIC_ASSETS` array if needed
3. Deploy the new service worker
4. Users will automatically get the update on next visit

### Clearing Cache
Users can clear the cache:
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Check "Cache storage" and "Service Workers"
5. Click "Clear site data"

## Background Sync

### Cart Sync
When offline, cart changes are stored in `localStorage` with key `pending_cart_sync`. When connection is restored, the service worker automatically syncs the data.

### Order Sync
When offline, completed orders are stored in `localStorage` with key `pending_order_sync`. When connection is restored, the service worker automatically syncs the data.

### Customization
To customize sync behavior, edit the `syncCart()` and `syncOrder()` functions in `sw.js`. Currently, they just log the data - in production, you would send it to your server.

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (iOS 11.3+, macOS)
- ⚠️ Safari (iOS) - Limited PWA support
- ❌ Internet Explorer - Not supported

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Verify `sw.js` is accessible (not 404)
- Check HTTPS requirement (required for service workers)
- Verify service worker scope matches your domain

### App Not Installing
- Verify manifest.json is accessible
- Check manifest.json is valid JSON
- Ensure icons are accessible
- Check browser support (Chrome/Edge recommended)

### Offline Page Not Showing
- Verify `offline.html` exists and is accessible
- Check service worker is active
- Verify cache includes offline.html
- Check browser console for errors

### Background Sync Not Working
- Verify browser supports Background Sync API
- Check service worker is active
- Verify data is stored in localStorage
- Check browser console for sync events

## Next Steps

### Production Enhancements
1. **Server Integration**: Update `syncCart()` and `syncOrder()` to send data to your server
2. **Push Notifications**: Add push notification support for order updates
3. **Better Icons**: Create proper app icons (192x192 and 512x512 PNG files)
4. **Screenshots**: Add screenshots to manifest.json for app store listings
5. **Analytics**: Track PWA installs and usage

### Performance
1. **Cache Strategy**: Optimize cache strategy for your use case
2. **Precache**: Add more assets to STATIC_ASSETS for better offline experience
3. **Lazy Loading**: Implement lazy loading for images in service worker

## Files Created

- `sw.js` - Service Worker
- `manifest.json` - Web App Manifest
- `offline.html` - Offline page
- `assets/js/pwa-install.js` - PWA installation handler

## Files Modified

- All HTML files - Added manifest link and PWA script
- `assets/js/cart.js` - Added background sync for cart
- `assets/js/checkout.js` - Added background sync for orders

## Security Notes

- Service workers require HTTPS (except localhost)
- Manifest must be served from same origin
- Background sync requires user interaction first

