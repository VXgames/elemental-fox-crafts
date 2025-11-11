# Data File Index

## 📁 Complete List of JSON Data Files

This document lists all JSON data files and their corresponding HTML pages.

---

## 🛍️ Shop Page

### `assets/data/shop-categories.json`
- **Page**: `shop.html`
- **Script**: `assets/js/shop-categories.js`
- **Purpose**: Lists all main categories (Weaving Tools, Copper Works, etc.)

---

## ⭐ Featured Items (Mega-Menu)

### `assets/data/featured-items.json`
- **Pages**: All pages with mega-menu (index.html, shop.html, etc.)
- **Script**: `assets/js/featured-items.js`
- **Purpose**: Lists 3 featured items shown in the shop mega-menu

---

## 📂 Category Pages (Subcategory Listings)

These pages show subcategories within a category.

### `assets/data/category-weaving.json`
- **Page**: `category-weaving.html`
- **Script**: `assets/js/category-loader.js`
- **Subcategories**: Bodkins, Mallets, Rapping Irons, 4-Way Cleave, Heddles/Reed Hooks, Pickup Sticks, Warping Sticks, Weaving Forks, Tapestry Bobbins, Nalbinding Needles

### `assets/data/category-copper.json`
- **Page**: `category-copper.html`
- **Script**: `assets/js/category-loader.js`
- **Subcategories**: Copper Spoons, Copper Ladles, Copper Jewellery

### `assets/data/category-cattoys.json`
- **Page**: `category-cattoys.html`
- **Script**: `assets/js/category-loader.js`
- **Subcategories**: Real Feather Cat Toys, Willow Handles with String, Real Fur Toys

### `assets/data/category-knives.json`
- **Page**: `category-knives.html`
- **Script**: `assets/js/category-loader.js`
- **Subcategories**: Marking Knives, Curved Knives for Weaving

### `assets/data/category-wands.json`
- **Page**: `category-wands.html`
- **Script**: `assets/js/subcategory-loader.js` (Note: This page shows products directly, not subcategories)
- **Products**: Cherry Wood Wand, Purple Heart Wand, Walnut Wand

---

## 🎯 Subcategory Pages (Product Listings)

These pages show individual products within a subcategory.

### `assets/data/product-bodkins.json`
- **Page**: `product-bodkins.html`
- **Script**: `assets/js/subcategory-loader.js`
- **Products**: Various Steel & Walnut Bodkins, Cherry Wood Bodkins

### Additional Subcategory JSON Files (To Be Created)

You'll need to create JSON files for other subcategory pages:
- `product-copper-spoons.json` → `product-copper-spoons.html`
- `product-copper-ladles.json` → `product-copper-ladles.html`
- `product-copper-jewellery.json` → `product-copper-jewellery.html`
- `product-mallets.json` → `product-mallets.html`
- `product-rapping-irons.json` → `product-rapping-irons.html`
- `product-4-way-cleave.json` → `product-4-way-cleave.html`
- `product-heddles-reed-hooks.json` → `product-heddles-reed-hooks.html`
- `product-pickup-sticks.json` → `product-pickup-sticks.html`
- `product-warping-sticks.json` → `product-warping-sticks.html`
- `product-weaving-forks.json` → `product-weaving-forks.html`
- `product-tapestry-bobbins.json` → `product-tapestry-bobbins.html`
- `product-nalbinding-needles.json` → `product-nalbinding-needles.html`
- `product-cattoys-feather.json` → `product-cattoys-feather.html`
- `product-cattoys-willow.json` → `product-cattoys-willow.html`
- `product-cattoys-fur.json` → `product-cattoys-fur.html`
- `product-marking-knives.json` → `product-marking-knives.html`
- `product-curved-knives.json` → `product-curved-knives.html`

---

## 🔄 File Naming Convention

### Category Pages
- **JSON**: `category-[name].json`
- **HTML**: `category-[name].html`
- **Script**: `category-loader.js`

### Subcategory Pages
- **JSON**: `product-[name].json`
- **HTML**: `product-[name].html`
- **Script**: `subcategory-loader.js`

---

## 📝 How to Add Scripts to HTML

### Category Pages
Add before `</body>`:
```html
<script src="./assets/js/category-loader.js"></script>
```

### Subcategory Pages
Add before `</body>`:
```html
<script src="./assets/js/subcategory-loader.js"></script>
```

---

## ✅ Checklist

### Created Files
- [x] `shop-categories.json`
- [x] `featured-items.json`
- [x] `category-weaving.json`
- [x] `category-copper.json`
- [x] `category-cattoys.json`
- [x] `category-knives.json`
- [x] `category-wands.json` (uses subcategory format)
- [x] `product-bodkins.json`

### To Be Created
- [ ] `product-copper-spoons.json`
- [ ] `product-copper-ladles.json`
- [ ] `product-copper-jewellery.json`
- [ ] `product-mallets.json`
- [ ] `product-rapping-irons.json`
- [ ] `product-4-way-cleave.json`
- [ ] `product-heddles-reed-hooks.json`
- [ ] `product-pickup-sticks.json`
- [ ] `product-warping-sticks.json`
- [ ] `product-weaving-forks.json`
- [ ] `product-tapestry-bobbins.json`
- [ ] `product-nalbinding-needles.json`
- [ ] `product-cattoys-feather.json`
- [ ] `product-cattoys-willow.json`
- [ ] `product-cattoys-fur.json`
- [ ] `product-marking-knives.json`
- [ ] `product-curved-knives.json`

---

## 🚀 Quick Start

1. **Edit a category page**: Open `assets/data/category-[name].json`
2. **Edit a subcategory page**: Open `assets/data/product-[name].json`
3. **Add scripts to HTML**: Add the appropriate loader script before `</body>`
4. **Save and test**: Refresh the page to see changes

---

**Last Updated**: Based on current implementation

