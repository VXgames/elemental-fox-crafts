# Troubleshooting Shop Categories Not Appearing

## 🔍 Common Issues and Solutions

### Issue 1: CORS Error (Most Common)

**Symptom**: Categories don't load, console shows CORS error or "Failed to fetch"

**Cause**: Opening HTML file directly (`file://` protocol) blocks JSON loading

**Solution**: Use a local web server

#### Option A: Use VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `shop.html`
3. Select "Open with Live Server"

#### Option B: Use Python (if installed)
```bash
# Navigate to project folder
cd "H:\Elemental Fox Crafts\Website\elemental-fox-simple"

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000/shop.html
```

#### Option C: Use Node.js http-server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project folder
cd "H:\Elemental Fox Crafts\Website\elemental-fox-simple"

# Start server
http-server

# Then open: http://localhost:8080/shop.html
```

---

### Issue 2: JSON File Not Found

**Symptom**: Console shows "404 Not Found" or "Failed to load shop categories"

**Check**:
1. Verify file exists: `assets/data/shop-categories.json`
2. Check file path is correct in browser console
3. Verify JSON syntax is valid (no trailing commas, proper quotes)

**Solution**: 
- Check file location matches exactly
- Validate JSON at https://jsonlint.com/

---

### Issue 3: Images Not Loading

**Symptom**: Categories appear but images are broken

**Check**:
1. Verify image files exist in `assets/images/categories/`
2. Check file names match exactly (case-sensitive!)
3. Check browser console for image load errors

**Common Issues**:
- Wrong file extension (`.jpg` vs `.JPG`)
- Wrong case (`Weaving-tools.jpg` vs `weaving-tools.jpg`)
- Path conversion issue

**Solution**: 
- Verify exact file names match JSON
- Check console for exact image path being used
- Ensure images are in correct folder

---

### Issue 4: Script Not Loading

**Symptom**: Nothing happens, no console messages

**Check**:
1. Verify `shop-categories.js` exists
2. Check browser console for script errors
3. Verify script tag is inside `</body>` tag

**Solution**:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see if script loads

---

## 🔧 Debugging Steps

### Step 1: Open Browser Console
1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Look for error messages

### Step 2: Check What's Loading
1. Go to **Network** tab in DevTools
2. Refresh the page
3. Look for:
   - `shop-categories.js` - should load successfully
   - `shop-categories.json` - should load successfully (status 200)
   - Image files - should load successfully

### Step 3: Verify JSON Structure
1. Open `assets/data/shop-categories.json`
2. Check it's valid JSON (no syntax errors)
3. Verify all paths use double backslashes: `.\\assets\\images\\...`

### Step 4: Test Image Paths
1. In browser console, type:
   ```javascript
   fetch('./assets/data/shop-categories.json')
     .then(r => r.json())
     .then(data => console.log(data))
   ```
2. Check if JSON loads
3. Check converted image paths

---

## ✅ Quick Checklist

- [ ] Using a local web server (not `file://`)
- [ ] `shop-categories.json` exists and is valid JSON
- [ ] `shop-categories.js` exists and loads
- [ ] Image files exist in correct folder
- [ ] File names match exactly (case-sensitive)
- [ ] Browser console shows no errors
- [ ] Network tab shows JSON and images loading

---

## 🐛 Still Not Working?

### Check Browser Console Messages

The updated script now logs detailed information:
- "Loading shop categories..." - Script started
- "Products grid found, fetching JSON..." - Container found
- "JSON loaded successfully" - JSON file loaded
- "Found X categories" - Categories parsed
- "Category X: Name, Image path: ..." - Each category being processed
- "Shop categories loaded successfully!" - All done!

### Common Error Messages

**"Failed to fetch"**
→ Use a web server, don't open file directly

**"404 Not Found"**
→ Check file path is correct

**"Failed to load image: ..."**
→ Check image file exists and path is correct

**"No categories found in JSON data"**
→ Check JSON structure is correct

---

## 💡 Pro Tip

**Always use a local web server when developing!**

This prevents CORS issues and makes debugging much easier.

---

**Last Updated**: Based on current implementation

