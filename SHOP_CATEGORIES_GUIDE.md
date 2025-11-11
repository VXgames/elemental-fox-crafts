# Shop Categories Management Guide

## 🎯 Overview

The category cards on the Shop page are now managed through a **single JSON file**. This means you only need to update **one file** instead of editing the HTML directly!

---

## 📝 How to Update Shop Categories

### Step 1: Open the JSON File

Open: `assets/data/shop-categories.json`

### Step 2: Edit the Category Information

Update any of these fields for each category:
- `name` - Category name (e.g., "Weaving Tools")
- `link` - Link to category page (e.g., "category-weaving.html")
- `image` - Image path for the category card
- `alt` - Alt text for accessibility
- `description` - Category description text

### Step 3: Save the File

That's it! The changes will automatically appear on the Shop page.

---

## 📋 Example: Updating a Category

### Before:
```json
{
  "id": 1,
  "name": "Weaving Tools",
  "link": "category-weaving.html",
  "image": "./assets/images/Bodkins/Steel and walnut 1/001.JPG",
  "description": "Bodkins, mallets, rapping irons, and more essential weaving tools"
}
```

### After (changing description and image):
```json
{
  "id": 1,
  "name": "Weaving Tools",
  "link": "category-weaving.html",
  "image": "./assets/images/categories/weaving-tools.jpg",
  "description": "Essential tools for traditional weaving techniques"
}
```

**Result**: The Shop page will automatically show the new image and description!

---

## 🎨 Current Shop Categories

1. **Weaving Tools** - Bodkins, mallets, rapping irons, and more essential weaving tools
2. **Copper Works** - Hand-forged spoons, ladles, jewellery, and decorative pieces
3. **Cat Toys** - Natural feather toys, willow handles with string, and real fur toys
4. **Knives** - Marking knives, curved knives for weaving, and more
5. **Magic Wands** - Handmade wands crafted from select hardwoods

---

## 🔄 Adding a New Category

To add a new category to the Shop page:

1. **Add a new entry** to `assets/data/shop-categories.json`:
```json
{
  "id": 6,
  "name": "New Category",
  "link": "category-new.html",
  "image": "./assets/images/categories/new-category.jpg",
  "alt": "New Category Collection",
  "description": "Description of the new category"
}
```

2. **Save the file** - The new category will automatically appear on the Shop page!

---

## 🔄 Removing a Category

To remove a category:

1. **Delete the category entry** from `assets/data/shop-categories.json`
2. **Save the file** - The category will automatically disappear from the Shop page

---

## 🔄 Reordering Categories

To change the order of categories on the Shop page:

1. **Reorder the entries** in `assets/data/shop-categories.json`
2. **Save the file** - Categories will appear in the new order!

---

## 📁 File Structure

```
assets/
├── data/
│   └── shop-categories.json    ← Edit this file only!
├── images/
│   └── [category images]        ← Update image paths here
└── js/
    └── shop-categories.js       ← Don't edit (auto-loads JSON)
```

---

## ✅ Benefits

- ✅ **One file to edit** instead of HTML
- ✅ **Automatic updates** on the Shop page
- ✅ **Easy to add/remove/reorder** categories
- ✅ **No HTML editing** required
- ✅ **Less error-prone** (no copy-paste mistakes)

---

## 🚀 Quick Reference

**To change a category name**: Edit `name` in JSON  
**To change a description**: Edit `description` in JSON  
**To change an image**: Update `image` path in JSON (see PATH_FORMAT_GUIDE.md for path format)  
**To change a link**: Edit `link` in JSON  
**To add a category**: Add a new entry to the `categories` array  
**To remove a category**: Delete the entry from the `categories` array  
**To reorder categories**: Reorder entries in the `categories` array

## 📁 Image Path Format

You can use Windows-style paths with backslashes! Just **double the backslashes** in JSON:

```json
"image": "\\assets\\images\\categories\\Weaving-tools.jpg"
```

Or use web-style paths with forward slashes:

```json
"image": "./assets/images/categories/Weaving-tools.jpg"
```

**Both formats work!** See `PATH_FORMAT_GUIDE.md` for detailed instructions.

---

## 📞 Need Help?

- **File location**: `assets/data/shop-categories.json`
- **Image location**: Update image paths in JSON (use the new structure from `IMAGE_STRUCTURE_SIMPLIFIED.md`)
- **Shop page updates automatically** - no need to edit HTML!

---

## 💡 Tips

1. **Use the new image structure**: Consider moving category images to `assets/images/categories/` for consistency
2. **Keep descriptions concise**: Short, descriptive text works best
3. **Use descriptive alt text**: Helps with accessibility and SEO
4. **Test after changes**: Refresh the Shop page to see your changes

---

**Last Updated**: Based on current implementation

