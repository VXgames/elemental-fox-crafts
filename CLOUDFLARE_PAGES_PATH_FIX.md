# Cloudflare Pages Path Resolution Fix

## Issue
The site works on preview URL (`2f2f528b.elemental-fox-crafts.pages.dev`) but not on production URL (`elemental-fox-crafts.pages.dev`). Both show:
- CSS not loading (stylesheet warning visible)
- Products not loading (empty products grid)
- JavaScript errors in console

## Root Cause
**Relative paths (`./`) resolve differently depending on URL structure:**
- URLs without `.html` extension: `/product-bodkins` 
- Relative path `./assets/data/product-bodkins.json` might resolve incorrectly
- Cloudflare Pages may serve files differently on preview vs production

## Solution: Use Absolute Paths

Absolute paths (starting with `/`) always resolve from the domain root, regardless of URL structure.

### Changes Made

#### 1. JSON Path in `subcategory-loader.js`
**Before:**
```javascript
const jsonPath = `./assets/data/${jsonFile}`;
```

**After:**
```javascript
const jsonPath = `/assets/data/${jsonFile}`;
```

#### 2. Image Path Conversion
**Before:**
```javascript
if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
  imagePath = './' + imagePath;
}
```

**After:**
```javascript
// Convert relative paths to absolute paths for Cloudflare Pages compatibility
if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
  imagePath = imagePath.replace(/^\.\//, '');
  if (!imagePath.startsWith('/')) {
    imagePath = '/' + imagePath;
  }
}
```

### Why This Works

1. **Absolute paths are consistent**: `/assets/data/product-bodkins.json` works the same on:
   - `https://2f2f528b.elemental-fox-crafts.pages.dev/product-bodkins`
   - `https://elemental-fox-crafts.pages.dev/product-bodkins`
   - `https://elemental-fox-crafts.pages.dev/product-bodkins.html`

2. **No dependency on URL structure**: Absolute paths don't care about:
   - Whether URL has `.html` extension
   - Whether URL has trailing slash
   - Current directory context

### Additional Considerations

#### HTML File Paths
HTML files still use relative paths for assets:
```html
<link rel="stylesheet" href="./style.css" type="text/css">
<script src="./assets/js/subcategory-loader.js"></script>
```

**These should work fine** because:
- Browser resolves them relative to the HTML file's location
- Cloudflare Pages serves HTML files correctly

**If CSS still doesn't load**, check:
1. File exists on server: `https://elemental-fox-crafts.pages.dev/style.css`
2. File permissions are correct
3. No server configuration blocking CSS files
4. Browser cache (hard refresh: Ctrl+Shift+R)

#### Cloudflare Pages Configuration

1. **Build Settings**: Ensure build output directory is correct (usually root `/`)
2. **File Deployment**: Verify all files are deployed:
   - `style.css` (root)
   - `assets/js/*.js` (all JavaScript files)
   - `assets/data/*.json` (all JSON files)
   - `assets/images/**/*` (all image files)

3. **Redirects/Rewrites**: Check `_redirects` file or Cloudflare Pages settings:
   - Should not interfere with asset paths
   - Should allow direct access to JSON files

### Testing

1. **Test JSON file directly**:
   - Preview: `https://2f2f528b.elemental-fox-crafts.pages.dev/assets/data/product-bodkins.json`
   - Production: `https://elemental-fox-crafts.pages.dev/assets/data/product-bodkins.json`
   - Both should return JSON content

2. **Test CSS file directly**:
   - Preview: `https://2f2f528b.elemental-fox-crafts.pages.dev/style.css`
   - Production: `https://elemental-fox-crafts.pages.dev/style.css`
   - Both should return CSS content

3. **Check browser console**:
   - Open DevTools → Console
   - Look for 404 errors or path resolution issues
   - Check Network tab for failed requests

### Deployment Checklist

- [ ] All JSON files deployed to `assets/data/`
- [ ] All JavaScript files deployed to `assets/js/`
- [ ] CSS file deployed to root (`style.css`)
- [ ] Image files deployed to `assets/images/`
- [ ] Updated `subcategory-loader.js` deployed
- [ ] Clear Cloudflare cache after deployment
- [ ] Test on both preview and production URLs

### If Issues Persist

1. **Check Cloudflare Pages Build Logs**:
   - Ensure all files are included in build
   - Check for build errors

2. **Verify File Structure on Server**:
   - Use Cloudflare Pages file browser
   - Verify files exist at correct paths

3. **Check Browser Console**:
   - Look for specific error messages
   - Check Network tab for failed requests
   - Verify response status codes

4. **Test with Hard Refresh**:
   - Clear browser cache
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

5. **Check Cloudflare Cache**:
   - Cloudflare may cache old versions
   - Purge cache in Cloudflare dashboard
   - Wait a few minutes for cache to clear

### Related Files to Update

If issues persist, consider updating these files to use absolute paths:
- `category-loader.js` - Category JSON loading
- `product-detail-loader.js` - Product detail JSON loading
- `search-filter.js` - Product search JSON loading
- `search-results.js` - Search results JSON loading
- `featured-items.js` - Featured items JSON loading

All these files use similar path resolution logic and should be updated consistently.

