# Image File Structure - Quick Reference

## 📁 Folder Structure (Simplified)

```
assets/images/
│
├── featured/                          # Mega-menu (3 items)
│   ├── item-01/preview-medium.jpg
│   ├── item-02/preview-medium.jpg
│   └── item-03/preview-medium.jpg
│
├── categories/                        # Category hero images
│   ├── copper-works/hero-medium.jpg
│   ├── weaving-tools/hero-medium.jpg
│   └── [category]/hero-medium.jpg
│
└── products/                          # All product images
    ├── [category]/                   # e.g., copper-works
    │   ├── [subcategory]/            # e.g., copper-spoons
    │   │   ├── subcategory-preview-medium.jpg  # For category page
    │   │   └── [product-name]/       # e.g., copper-tea-spoon
    │   │       ├── 01-main-small.jpg
    │   │       ├── 01-main-medium.jpg
    │   │       ├── 01-main-large.jpg
    │   │       ├── 02-detail-small.jpg
    │   │       ├── 02-detail-medium.jpg
    │   │       └── 02-detail-large.jpg
    │   └── [other-subcategories]/
    └── [other-categories]/
```

---

## 🎯 File Path Templates

### Mega-Menu Featured Item
```
./assets/images/featured/[item-name]/preview-medium.jpg
```

### Category Hero Image
```
./assets/images/categories/[category-name]/hero-medium.jpg
```

### Subcategory Preview (on Category Page)
```
./assets/images/products/[category]/[subcategory]/subcategory-preview-medium.jpg
```

### Product Card (on Subcategory Page)
```
./assets/images/products/[category]/[subcategory]/[product-name]/01-main-medium.jpg
```

### Product Detail Page
```
./assets/images/products/[category]/[subcategory]/[product-name]/01-main-large.jpg
./assets/images/products/[category]/[subcategory]/[product-name]/02-detail-large.jpg
./assets/images/products/[category]/[subcategory]/[product-name]/03-detail-large.jpg
```

---

## 📏 Image Sizes

| Image Type | Small | Medium | Large |
|------------|-------|--------|-------|
| **Featured (Mega-Menu)** | 400×400 | 600×600 | 800×800 |
| **Category Hero** | 800×600 | 1200×800 | 1920×1080 |
| **Subcategory Preview** | 400×400 | 800×800 | 1200×1200 |
| **Product Card** | 400×400 | 800×800 | 1200×1200 |
| **Product Detail** | 400×400 | 800×800 | 1200×1200 |

**Note**: All product images are **square (1:1 ratio)** except category heroes.

---

## 🏷️ Naming Conventions

### Folders
- Use **kebab-case**: `copper-works`, `copper-spoons`, `walnut-steel-bodkin`
- No spaces, no special characters except hyphens
- Be descriptive

### Files
- **Main image**: `01-main-small.jpg`, `01-main-medium.jpg`, `01-main-large.jpg`
- **Detail images**: `02-detail-*.jpg`, `03-detail-*.jpg`, etc.
- **Preview images**: `subcategory-preview-*.jpg`, `preview-*.jpg`
- Always include size suffix: `-small`, `-medium`, `-large`

---

## 📋 Current Categories

1. **Copper Works**
   - Copper Spoons
   - Copper Ladles
   - Copper Jewellery

2. **Weaving Tools**
   - Bodkins

3. **Wands**

4. **Cat Toys**

5. **Knives**

---

## ✅ Quick Checklist

When adding a new product:

- [ ] Create folder: `products/[category]/[subcategory]/[product-name]/`
- [ ] Add main image: `01-main-small.jpg`, `01-main-medium.jpg`, `01-main-large.jpg`
- [ ] Add detail images: `02-detail-*.jpg`, `03-detail-*.jpg`, etc.
- [ ] Update subcategory preview (if needed)
- [ ] Update featured items (if best-seller)
- [ ] Update HTML with correct paths

---

## 🔗 Example Paths

### Mega-Menu
```
./assets/images/featured/walnut-steel-bodkin/preview-medium.jpg
```

### Category Page
```
./assets/images/categories/copper-works/hero-medium.jpg
./assets/images/products/copper-works/copper-spoons/subcategory-preview-medium.jpg
```

### Product Detail
```
./assets/images/products/copper-works/copper-spoons/copper-tea-spoon/01-main-large.jpg
./assets/images/products/copper-works/copper-spoons/copper-tea-spoon/02-detail-large.jpg
```

---

**See `IMAGE_FILE_STRUCTURE.md` for complete documentation.**

