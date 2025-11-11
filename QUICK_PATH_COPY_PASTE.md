# Quick Path Copy-Paste Guide

## 🎯 Super Simple Method

**Yes, you can use Windows paths!** Here's the easiest way:

---

## 📋 Step-by-Step: Copy-Paste Windows Paths

### Method 1: Quick Copy-Paste (Recommended)

1. **Copy the path from Windows File Explorer**
   ```
   assets\images\categories\Weaving-tools.jpg
   ```

2. **Paste it into JSON with a dot at the start**
   ```json
   "image": ".assets\images\categories\Weaving-tools.jpg"
   ```

3. **Use Find & Replace (Ctrl+H) to double all backslashes**
   - Find: `\`
   - Replace: `\\`
   - Click "Replace All"
   
4. **Result:**
   ```json
   "image": ".\\assets\\images\\categories\\Weaving-tools.jpg"
   ```

**Done!** ✅

---

## 💡 Even Easier: Use This Format Directly

Just remember: **Start with a dot, use double backslashes**

```json
"image": ".\\assets\\images\\categories\\Weaving-tools.jpg"
```

**Pattern:**
- Start with: `.\\`
- Then your path with: `\\` (double backslashes) between folders
- End with: `.jpg` (or your file extension)

---

## 📝 Examples

### From Windows Explorer:
```
assets\images\categories\Weaving-tools.jpg
```

### In JSON (after Find & Replace):
```json
"image": ".\\assets\\images\\categories\\Weaving-tools.jpg"
```

---

## ✅ Both Formats Work!

You can use **either format**:

### Windows Style (with backslashes):
```json
"image": ".\\assets\\images\\categories\\Weaving-tools.jpg"
```

### Web Style (with forward slashes):
```json
"image": "./assets/images/categories/Weaving-tools.jpg"
```

**Both work perfectly!** The JavaScript converts them automatically.

---

## 🚀 Pro Tip

**Use Find & Replace every time:**
1. Paste your Windows path
2. Add `.` at the start
3. Find & Replace: `\` → `\\`
4. Done!

This takes 2 seconds and works every time!

---

**See `PATH_FORMAT_GUIDE.md` for more detailed information.**

