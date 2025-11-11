# Featured Items Management Guide

## 🎯 Overview

The featured items in the mega-menu are now managed through a **single JSON file**. This means you only need to update **one file** instead of editing 15+ HTML files!

---

## 📝 How to Update Featured Items

### Step 1: Open the JSON File

Open: `assets/data/featured-items.json`

### Step 2: Edit the Product Information

Update any of these fields for each item:
- `title` - Product name
- `price` - Product price (include $ sign)
- `stars` - Star rating (use ★ for filled, ☆ for empty)
- `colors` - Array of color hex codes (e.g., `["#4a3828", "#8c8c8c"]`)
- `image` - Image path (usually stays the same)
- `alt` - Alt text for accessibility

### Step 3: Save the File

That's it! The changes will automatically appear on **all pages** of your website.

---

## 📋 Example: Updating a Featured Item

### Before:
```json
{
  "id": 1,
  "title": "Copper Coffee Spoon 1",
  "price": "$85.00",
  "stars": "★ ★ ★ ★ ★"
}
```

### After (changing price and title):
```json
{
  "id": 1,
  "title": "Copper Coffee Spoon - Large",
  "price": "$95.00",
  "stars": "★ ★ ★ ★ ★"
}
```

**Result**: All 15+ HTML pages will automatically show the new price and title!

---

## 🎨 Current Featured Items

Based on your current `index.html`:

1. **Copper Coffee Spoon 1** - $85.00
2. **Feather Cat Toy** - $45.00
3. **Black Walnut Bodkin** - $22.00

---

## 🔄 Changing Featured Items

To replace a featured item with a different product:

1. **Update the image**: Replace the image file in `assets/images/featured/`
   - `item-01.jpg` - First featured item
   - `item-02.jpg` - Second featured item
   - `item-03.jpg` - Third featured item

2. **Update the JSON**: Edit `assets/data/featured-items.json` with new product info

3. **Done!** All pages update automatically.

---

## 📁 File Structure

```
assets/
├── data/
│   └── featured-items.json    ← Edit this file only!
├── images/
│   └── featured/
│       ├── item-01.jpg        ← Replace images here
│       ├── item-02.jpg
│       └── item-03.jpg
└── js/
    └── featured-items.js      ← Don't edit (auto-loads JSON)
```

---

## ✅ Benefits

- ✅ **One file to edit** instead of 15+
- ✅ **Automatic updates** across all pages
- ✅ **No HTML editing** required
- ✅ **Easy to maintain** and update
- ✅ **Less error-prone** (no copy-paste mistakes)

---

## 🚀 Quick Reference

**To change a product name**: Edit `title` in JSON  
**To change a price**: Edit `price` in JSON  
**To change colors**: Edit `colors` array in JSON  
**To change rating**: Edit `stars` in JSON  
**To change image**: Replace image file + update `image` path in JSON

## 📁 Image Path Format

You can use Windows-style paths with backslashes! Just **double the backslashes** in JSON:

```json
"image": "\\assets\\images\\featured\\item-01.jpg"
```

Or use web-style paths with forward slashes:

```json
"image": "./assets/images/featured/item-01.jpg"
```

**Both formats work!** See `PATH_FORMAT_GUIDE.md` for detailed instructions.

---

## 📞 Need Help?

- **File location**: `assets/data/featured-items.json`
- **Image location**: `assets/images/featured/`
- **All pages update automatically** - no need to edit HTML files!

---

**Last Updated**: Based on current implementation

