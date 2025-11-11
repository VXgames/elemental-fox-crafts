# Service Worker Cache Fix Guide

## Problem Identified

The Service Worker was intercepting failed JSON file requests and returning an empty object `{}`, which was then cached. This masked the real error (404, path issues, etc.) and caused the JSON parsing error.

## Changes Made

### 1. Service Worker (`sw.js`)
- **JSON Handling**: Changed to network-first strategy (fetch from network first, fallback to cache)
- **Error Handling**: Removed code that returns empty objects for failed JSON requests
- **Caching**: Only cache successful JSON responses (status 200)
- **Cache Version**: Updated to `v2` to force cache refresh

### 2. Subcategory Loader (`subcategory-loader.js`)
- **Path Fix**: Changed to absolute paths (`/assets/data/` instead of `./assets/data/`)
- **Debug Logging**: Added enhanced logging to help diagnose issues

## How to Fix on Live Server

### Step 1: Deploy Updated Files
1. Deploy the updated `sw.js` file
2. Deploy the updated `subcategory-loader.js` file
3. Wait for deployment to complete

### Step 2: Clear Service Worker Cache

**Option A: Unregister Service Worker (Recommended)**
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Service Workers** in the left sidebar
4. Find the service worker for your site
5. Click **Unregister**
6. Refresh the page

**Option B: Clear All Site Data**
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear storage** or **Clear site data**
4. Check all boxes
5. Click **Clear site data**
6. Refresh the page

**Option C: Update Service Worker Programmatically**
Add this code to your HTML temporarily (in `<head>`):
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
</script>
```
Remove this code after clearing the cache.

### Step 3: Verify Fix

1. **Hard Refresh**: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Check Console**: Open DevTools → Console
   - Should see: `=== Subcategory Loader Debug ===`
   - Should see: `Full JSON path: /assets/data/product-bodkins.json`
   - Should NOT see: `Loading subcategory data from: ./assets/data/product-bodkins`
3. **Check Network Tab**: Open DevTools → Network
   - Find the JSON file request
   - Check Status: Should be `200` (not `404`)
   - Check Response: Should be valid JSON (not empty object `{}`)

### Step 4: Test JSON File Directly

Open these URLs in your browser:
- `https://elemental-fox-crafts.pages.dev/assets/data/product-bodkins.json`
- Should return JSON content (not HTML error page)

## What Was Happening

1. **Old Service Worker** intercepted JSON file requests
2. If JSON file wasn't found (404), Service Worker returned `{}` (empty object)
3. This empty object was cached
4. Next request served the cached empty object instead of trying to fetch the real file
5. JavaScript tried to parse `{}` as JSON → Success, but no products
6. Or JavaScript tried to parse HTML error page → Parse error

## What's Fixed Now

1. **Service Worker** uses network-first for JSON files
2. **Real errors** (404, 500, etc.) are now visible
3. **Only successful responses** are cached
4. **Failed requests** don't create fake responses
5. **Absolute paths** ensure consistent path resolution

## Troubleshooting

### If JSON files still don't load:

1. **Check File Exists**: 
   - Open `https://elemental-fox-crafts.pages.dev/assets/data/product-bodkins.json` directly
   - Should return JSON, not 404

2. **Check Service Worker**:
   - DevTools → Application → Service Workers
   - Should see new version (v2) or no service worker
   - If old version, unregister it

3. **Check Browser Cache**:
   - Hard refresh: `Ctrl+Shift+R`
   - Or clear browser cache

4. **Check Cloudflare Cache**:
   - Cloudflare Dashboard → Caching → Purge Cache
   - Purge everything or just JSON files

5. **Check Console Errors**:
   - DevTools → Console
   - Look for specific error messages
   - Check Network tab for failed requests

### If Service Worker won't update:

1. **Unregister manually** (see Step 2 above)
2. **Close all tabs** with your site open
3. **Wait 24 hours** (browsers check for updates daily)
4. **Use Incognito/Private mode** to test (no service worker)

## Prevention

To prevent this issue in the future:

1. **Don't create fake responses** for failed requests in Service Worker
2. **Let errors propagate** so they can be handled properly
3. **Use network-first** strategy for dynamic content (JSON, API calls)
4. **Use cache-first** strategy only for static assets (CSS, JS, images)
5. **Increment cache version** when making Service Worker changes
6. **Test Service Worker changes** in development first

## Related Files

- `sw.js` - Service Worker (updated)
- `assets/js/subcategory-loader.js` - Subcategory loader (updated)
- `assets/js/category-loader.js` - Category loader (may need similar fix)
- `assets/js/product-detail-loader.js` - Product detail loader (may need similar fix)

## Next Steps

1. Deploy updated files
2. Clear Service Worker cache
3. Test on both preview and production URLs
4. Verify JSON files load correctly
5. Check console for any remaining errors

