# JSON Loading Troubleshooting Guide

## Issue: JSON Parse Error on Live Server

### Symptoms
- Error: `JSON.parse: unexpected character at line 1 column 1 of the JSON data`
- Works on localhost but fails on live server
- Console shows: `Loading subcategory data from: ./assets/data/product-bodkins.json`

### Common Causes

#### 1. File Not Uploaded to Server
**Solution**: Verify that the JSON file exists on the live server at the exact path:
- Check: `https://yourdomain.com/assets/data/product-bodkins.json`
- Ensure all JSON files in `assets/data/` are uploaded

#### 2. Case Sensitivity Issues
**Problem**: Linux servers are case-sensitive. File names must match exactly.
- Local (Windows): `product-bodkins.json` ✅
- Server (Linux): `product-Bodkins.json` ❌ (will fail)

**Solution**: 
- Ensure file names on server match exactly (lowercase recommended)
- Check file names in `assets/data/` directory on server

#### 3. Server Returns HTML Error Page
**Problem**: Server returns HTML (404 page) instead of JSON, causing parse error.

**Solution**: 
- Check server configuration
- Verify file permissions (should be readable: 644)
- Check if server has URL rewriting that might interfere

#### 4. Incorrect Content-Type Header
**Problem**: Server serves JSON with wrong MIME type.

**Solution**: 
- Configure server to serve `.json` files with `Content-Type: application/json`
- Add to `.htaccess` (Apache):
  ```apache
  AddType application/json .json
  ```

#### 5. Path Resolution Issues
**Problem**: Relative paths resolve differently on server.

**Solution**: 
- Verify the relative path works from the HTML file location
- Consider using absolute paths if needed

### Enhanced Error Handling

The updated `subcategory-loader.js` now includes:

1. **Path Validation**: Ensures `.json` extension is always present
2. **Content Type Checking**: Verifies server returns JSON content type
3. **HTML Detection**: Detects if server returns HTML error page
4. **Detailed Logging**: Logs response headers, content type, and response preview
5. **Better Error Messages**: Shows exact path attempted and server response

### Debugging Steps

1. **Check Browser Console**: Look for detailed error messages:
   ```
   Response content type: [content-type]
   Response text (first 500 chars): [preview]
   Attempted path: [path]
   ```

2. **Verify File Exists**: 
   - Open `https://yourdomain.com/assets/data/product-bodkins.json` directly in browser
   - Should show JSON content, not HTML error page

3. **Check Server Response**:
   - Open browser DevTools → Network tab
   - Reload page
   - Find the JSON file request
   - Check Status code (should be 200)
   - Check Content-Type header (should be `application/json`)
   - Check Response (should be valid JSON, not HTML)

4. **Test Direct Access**:
   - Try accessing JSON file directly: `https://yourdomain.com/assets/data/product-bodkins.json`
   - If it works, the file exists and is accessible
   - If it returns 404, the file is missing
   - If it returns HTML, server configuration issue

### Server Configuration

#### Apache (.htaccess)
```apache
# Ensure JSON files are served with correct content type
AddType application/json .json

# Allow access to JSON files
<FilesMatch "\.json$">
    Header set Content-Type "application/json"
</FilesMatch>
```

#### Nginx
```nginx
location ~ \.json$ {
    add_header Content-Type application/json;
    expires 1h;
}
```

### File Checklist

Verify these files exist on live server:
- [ ] `assets/data/product-bodkins.json`
- [ ] `assets/data/product-cattoys-feather.json`
- [ ] `assets/data/product-cattoys-fur.json`
- [ ] `assets/data/product-cattoys-willow.json`
- [ ] `assets/data/product-copper-jewellery.json`
- [ ] `assets/data/product-copper-ladles.json`
- [ ] `assets/data/product-copper-spoons.json`
- [ ] `assets/data/product-curved-knives.json`
- [ ] `assets/data/product-4-way-cleave.json`
- [ ] `assets/data/product-heddles-reed-hooks.json`
- [ ] `assets/data/product-mallets.json`
- [ ] `assets/data/product-marking-knives.json`
- [ ] `assets/data/product-nalbinding-needles.json`
- [ ] `assets/data/product-pickup-sticks.json`
- [ ] `assets/data/product-rapping-irons.json`
- [ ] `assets/data/product-tapestry-bobbins.json`
- [ ] `assets/data/product-warping-sticks.json`
- [ ] `assets/data/product-weaving-forks.json`
- [ ] `assets/data/category-weaving.json`
- [ ] `assets/data/category-copper.json`
- [ ] `assets/data/category-cattoys.json`
- [ ] `assets/data/category-knives.json`
- [ ] `assets/data/category-wands.json`
- [ ] `assets/data/featured-items.json`
- [ ] `assets/data/shop-categories.json`

### Next Steps

1. **Check Server Files**: Verify all JSON files are uploaded
2. **Test Direct Access**: Try accessing JSON files directly in browser
3. **Check Server Logs**: Look for 404 errors or permission issues
4. **Verify Content-Type**: Ensure server sends correct MIME type
5. **Test with Updated Code**: Deploy updated `subcategory-loader.js` with enhanced error handling

### Expected Console Output (Success)
```
Loading subcategory data from: ./assets/data/product-bodkins.json
Current page: product-bodkins.html
JSON file: product-bodkins.json
Response content type: application/json for path: ./assets/data/product-bodkins.json
Subcategory data loaded successfully: {subcategory: {...}, products: [...]}
```

### Expected Console Output (Error)
```
Loading subcategory data from: ./assets/data/product-bodkins.json
Current page: product-bodkins.html
JSON file: product-bodkins.json
Response content type: text/html for path: ./assets/data/product-bodkins.json
Server returned HTML instead of JSON. Response preview: <!DOCTYPE html>...
Error loading subcategory JSON: Error: Server returned HTML error page instead of JSON...
Attempted path: ./assets/data/product-bodkins.json
```

