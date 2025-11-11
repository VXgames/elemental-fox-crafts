# Category and Subcategory Data Management Guide

## 🎯 Overview

Category and subcategory pages are now managed through **JSON files**. This means you can update all product information from a single JSON file for each page!

---

## 📁 File Structure

### Category Pages (Subcategory Listings)
- **Location**: `assets/data/category-[name].json`
- **Examples**:
  - `category-weaving.json` → `category-weaving.html`
  - `category-copper.json` → `category-copper.html`

### Subcategory Pages (Product Listings)
- **Location**: `assets/data/product-[name].json`
- **Examples**:
  - `product-bodkins.json` → `product-bodkins.html`
  - `product-copper-spoons.json` → `product-copper-spoons.html`

---

## 📋 Category JSON Structure

### File: `category-weaving.json`

```json
{
  "category": {
    "name": "Weaving Tools",
    "description": "Handcrafted bodkins and weaving tools, carefully shaped from fine woods and steel."
  },
  "subcategories": [
    {
      "id": 1,
      "name": "Bodkins",
      "link": "product-bodkins.html",
      "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\subcategory-preview-medium.jpg",
      "imageSmall": ".\\assets\\images\\products\\weaving-tools\\bodkins\\subcategory-preview-small.jpg",
      "imageLarge": ".\\assets\\images\\products\\weaving-tools\\bodkins\\subcategory-preview-large.jpg",
      "alt": "Bodkins Collection",
      "description": "Essential tools for weaving, available in various wood and steel combinations"
    }
  ]
}
```

### Fields Explained

- **category.name**: Category title (shown in page header)
- **category.description**: Category description (shown in page header)
- **subcategories**: Array of subcategory objects
  - **id**: Unique identifier
  - **name**: Subcategory name (shown on card)
  - **link**: Link to subcategory page
  - **image**: Main image path (medium size)
  - **imageSmall**: Small image path (optional, for responsive images)
  - **imageLarge**: Large image path (optional, for responsive images)
  - **alt**: Alt text for accessibility
  - **description**: Subcategory description (shown on card)

---

## 📋 Subcategory JSON Structure

### File: `product-bodkins.json`

```json
{
  "subcategory": {
    "name": "Bodkins",
    "description": "Essential weaving tools available in various wood and steel combinations. Each bodkin is handcrafted for durability and precision."
  },
  "products": [
    {
      "id": 1,
      "name": "Steel & Walnut Bodkin",
      "price": "$24.00",
      "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-medium.jpg",
      "imageSmall": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-small.jpg",
      "imageLarge": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-large.jpg",
      "alt": "Steel and Walnut Bodkin #001",
      "link": "shop.html"
    }
  ]
}
```

### Fields Explained

- **subcategory.name**: Subcategory title (shown in page header)
- **subcategory.description**: Subcategory description (shown in page header)
- **products**: Array of product objects
  - **id**: Unique identifier
  - **name**: Product name (shown on card)
  - **price**: Product price (include $ sign)
  - **image**: Main image path (medium size)
  - **imageSmall**: Small image path (optional, for responsive images)
  - **imageLarge**: Large image path (optional, for responsive images)
  - **alt**: Alt text for accessibility
  - **link**: Link to product page or cart (usually "shop.html")

---

## 🔄 How to Update

### Updating a Category Page

1. **Open the JSON file**: `assets/data/category-[name].json`
2. **Edit the category info**:
   - Change `category.name` to update the page title
   - Change `category.description` to update the page description
3. **Edit subcategories**:
   - Add/remove/edit subcategory objects in the `subcategories` array
   - Update names, descriptions, links, or images
4. **Save the file** - Changes appear automatically!

### Updating a Subcategory Page

1. **Open the JSON file**: `assets/data/product-[name].json`
2. **Edit the subcategory info**:
   - Change `subcategory.name` to update the page title
   - Change `subcategory.description` to update the page description
3. **Edit products**:
   - Add/remove/edit product objects in the `products` array
   - Update names, prices, images, or links
4. **Save the file** - Changes appear automatically!

---

## 📝 Examples

### Adding a New Subcategory to Category Page

```json
{
  "subcategories": [
    // ... existing subcategories ...
    {
      "id": 11,
      "name": "New Tool",
      "link": "product-new-tool.html",
      "image": ".\\assets\\images\\products\\weaving-tools\\new-tool\\subcategory-preview-medium.jpg",
      "alt": "New Tool Collection",
      "description": "Description of the new tool"
    }
  ]
}
```

### Adding a New Product to Subcategory Page

```json
{
  "products": [
    // ... existing products ...
    {
      "id": 13,
      "name": "New Product",
      "price": "$30.00",
      "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\new-product\\01-main-medium.jpg",
      "alt": "New Product",
      "link": "shop.html"
    }
  ]
}
```

### Changing a Price

```json
{
  "products": [
    {
      "id": 1,
      "name": "Steel & Walnut Bodkin",
      "price": "$26.00",  // Changed from $24.00
      // ... other fields ...
    }
  ]
}
```

---

## 🖼️ Image Path Format

You can use Windows-style paths with backslashes! Just **double the backslashes** in JSON:

```json
"image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\subcategory-preview-medium.jpg"
```

Or use web-style paths with forward slashes:

```json
"image": "./assets/images/products/weaving-tools/bodkins/subcategory-preview-medium.jpg"
```

**Both formats work!** See `PATH_FORMAT_GUIDE.md` for detailed instructions.

---

## 🚀 Quick Reference

### Category Pages
- **File location**: `assets/data/category-[name].json`
- **Update category name**: Edit `category.name`
- **Update description**: Edit `category.description`
- **Add subcategory**: Add new object to `subcategories` array
- **Remove subcategory**: Delete object from `subcategories` array
- **Reorder subcategories**: Reorder objects in `subcategories` array

### Subcategory Pages
- **File location**: `assets/data/product-[name].json`
- **Update subcategory name**: Edit `subcategory.name`
- **Update description**: Edit `subcategory.description`
- **Add product**: Add new object to `products` array
- **Remove product**: Delete object from `products` array
- **Change price**: Edit `price` field
- **Reorder products**: Reorder objects in `products` array

---

## ✅ Benefits

- ✅ **One file per page** - Easy to manage
- ✅ **No HTML editing** - Update JSON only
- ✅ **Automatic updates** - Changes appear immediately
- ✅ **Easy to add/remove** - Just edit the arrays
- ✅ **Less error-prone** - No copy-paste mistakes

---

## 📞 Need Help?

- **Category pages**: Edit `assets/data/category-[name].json`
- **Subcategory pages**: Edit `assets/data/product-[name].json`
- **Image paths**: See `PATH_FORMAT_GUIDE.md`
- **Troubleshooting**: Check browser console for errors

---

## 🔧 Adding Scripts to HTML Pages

### For Category Pages (e.g., `category-weaving.html`)

Add before `</body>`:
```html
<script src="./assets/js/category-loader.js"></script>
```

### For Subcategory Pages (e.g., `product-bodkins.html`)

Add before `</body>`:
```html
<script src="./assets/js/subcategory-loader.js"></script>
```

---

**Last Updated**: Based on current implementation

