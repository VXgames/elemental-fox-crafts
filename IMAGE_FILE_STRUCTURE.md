# Image File Structure Guide
## Elemental Fox Crafts Website

This document defines the recommended file structure for organizing product images to make it easy for code to fetch and display images throughout the website.

---

## 📁 Root Structure

```
assets/images/
├── featured/                    # Mega-menu featured items (3 best sellers)
├── categories/                  # Category-level images
│   ├── copper-works/           # Category: Copper Works
│   ├── weaving-tools/          # Category: Weaving Tools
│   ├── wands/                  # Category: Wands
│   ├── cat-toys/               # Category: Cat Toys
│   ├── knives/                 # Category: Knives
│   └── [other-categories]/     # Other categories as needed
└── products/                    # Individual product images
    ├── copper-works/           # Products within Copper Works
    │   ├── copper-spoons/      # Subcategory: Copper Spoons
    │   ├── copper-ladles/      # Subcategory: Copper Ladles
    │   └── copper-jewellery/   # Subcategory: Copper Jewellery
    ├── weaving-tools/          # Products within Weaving Tools
    │   └── bodkins/            # Subcategory: Bodkins
    └── [other-categories]/     # Other product categories
```

---

## 🎯 1. Featured Items (Mega-Menu)

**Location**: `assets/images/featured/`

**Purpose**: Three best-selling items displayed in the Shop mega-dropdown menu

**Structure**:
```
assets/images/featured/
├── item-01/                    # Featured item #1
│   ├── preview-small.jpg      # 400×400px
│   ├── preview-medium.jpg     # 600×600px (PRIMARY - used in mega-menu)
│   └── preview-large.jpg      # 800×800px
├── item-02/                    # Featured item #2
│   ├── preview-small.jpg
│   ├── preview-medium.jpg
│   └── preview-large.jpg
└── item-03/                    # Featured item #3
    ├── preview-small.jpg
    ├── preview-medium.jpg
    └── preview-large.jpg
```

**Naming Convention**: 
- Use descriptive names: `item-01`, `item-02`, `item-03`
- OR use product names: `walnut-steel-bodkin`, `cherry-wood-wand`, `natural-cat-wand`
- Always include size suffix: `-small.jpg`, `-medium.jpg`, `-large.jpg`

**Code Reference**:
- File path: `./assets/images/featured/[item-name]/preview-medium.jpg`
- Example: `./assets/images/featured/walnut-steel-bodkin/preview-medium.jpg`

---

## 📂 2. Category Images

**Location**: `assets/images/categories/`

**Purpose**: Hero/header images for category pages (e.g., category-copper.html, category-wands.html)

**Structure**:
```
assets/images/categories/
├── copper-works/
│   ├── hero-small.jpg         # 800×600px
│   ├── hero-medium.jpg        # 1200×800px
│   └── hero-large.jpg         # 1920×1080px
├── weaving-tools/
│   ├── hero-small.jpg
│   ├── hero-medium.jpg
│   └── hero-large.jpg
└── [other-categories]/
    └── hero-[size].jpg
```

**Naming Convention**: 
- Folder name matches category slug: `copper-works`, `weaving-tools`, `wands`, `cat-toys`, `knives`
- Image name: `hero-small.jpg`, `hero-medium.jpg`, `hero-large.jpg`

**Code Reference**:
- File path: `./assets/images/categories/[category-name]/hero-medium.jpg`
- Example: `./assets/images/categories/copper-works/hero-medium.jpg`

---

## 🛍️ 3. Product Images (Subcategories & Individual Products)

**Location**: `assets/images/products/`

**Purpose**: All product images organized by category → subcategory → product

**Full Structure**:
```
assets/images/products/
├── copper-works/
│   ├── copper-spoons/          # Subcategory: Copper Spoons
│   │   ├── product-01/         # Individual product
│   │   │   ├── 01-main-small.jpg      # Main product image
│   │   │   ├── 01-main-medium.jpg
│   │   │   ├── 01-main-large.jpg
│   │   │   ├── 02-detail-small.jpg    # Additional detail images
│   │   │   ├── 02-detail-medium.jpg
│   │   │   ├── 02-detail-large.jpg
│   │   │   ├── 03-detail-small.jpg
│   │   │   ├── 03-detail-medium.jpg
│   │   │   ├── 03-detail-large.jpg
│   │   │   └── [additional-images]/   # More images as needed
│   │   ├── product-02/
│   │   │   └── [same structure]
│   │   └── subcategory-preview.jpg    # Preview for subcategory card
│   │
│   ├── copper-ladles/          # Subcategory: Copper Ladles
│   │   ├── product-01/
│   │   │   └── [same structure]
│   │   ├── product-02/
│   │   │   └── [same structure]
│   │   └── subcategory-preview.jpg
│   │
│   └── copper-jewellery/       # Subcategory: Copper Jewellery
│       ├── product-01/
│       │   └── [same structure]
│       └── subcategory-preview.jpg
│
├── weaving-tools/
│   ├── bodkins/                # Subcategory: Bodkins
│   │   ├── walnut-steel-bodkin/
│   │   │   ├── 01-main-small.jpg
│   │   │   ├── 01-main-medium.jpg
│   │   │   ├── 01-main-large.jpg
│   │   │   ├── 02-detail-small.jpg
│   │   │   └── [additional-images]/
│   │   ├── cherry-bodkin/
│   │   │   └── [same structure]
│   │   └── subcategory-preview.jpg
│   │
│   └── [other-subcategories]/
│       └── [same structure]
│
├── wands/
│   └── [subcategories]/
│       └── [products]/
│
├── cat-toys/
│   └── [subcategories]/
│       └── [products]/
│
└── knives/
    └── [subcategories]/
        └── [products]/
```

---

## 📋 Detailed Naming Conventions

### A. Product Folders
- **Use kebab-case**: `walnut-steel-bodkin`, `copper-tea-spoon`, `cherry-wood-wand`
- **Be descriptive**: Include material, type, and distinguishing features
- **Avoid special characters**: Use hyphens, no spaces, no underscores (except in image numbers)

### B. Product Images
- **Main product image**: `01-main-small.jpg`, `01-main-medium.jpg`, `01-main-large.jpg`
- **Detail images**: `02-detail-small.jpg`, `03-detail-small.jpg`, etc.
- **Additional views**: `04-angle-small.jpg`, `05-closeup-small.jpg`, etc.
- **Numbering**: Always use two digits (01, 02, 03, ...) for proper sorting

### C. Subcategory Preview Images
- **Location**: Inside subcategory folder, at the root level
- **Name**: `subcategory-preview-small.jpg`, `subcategory-preview-medium.jpg`, `subcategory-preview-large.jpg`
- **Purpose**: Used on category pages to show the subcategory card

---

## 🔗 Code Integration Examples

### Mega-Menu Featured Items
```html
<!-- In index.html and other pages -->
<img src="./assets/images/featured/walnut-steel-bodkin/preview-medium.jpg" 
     alt="Walnut & Steel Bodkin">
```

### Category Page Hero
```html
<!-- In category-copper.html -->
<img src="./assets/images/categories/copper-works/hero-medium.jpg" 
     alt="Copper Works Collection">
```

### Subcategory Card (on Category Page)
```html
<!-- In category-copper.html -->
<img src="./assets/images/products/copper-works/copper-spoons/subcategory-preview-medium.jpg" 
     alt="Copper Spoons Collection">
```

### Product Card (on Subcategory Page)
```html
<!-- In product-copper-spoons.html or subcategory listing -->
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon/01-main-medium.jpg" 
     alt="Copper Tea Spoon">
```

### Product Detail Page (Multiple Images)
```html
<!-- In individual product page -->
<!-- Main image -->
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon/01-main-large.jpg" 
     alt="Copper Tea Spoon - Main View">

<!-- Gallery images -->
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon/02-detail-large.jpg" 
     alt="Copper Tea Spoon - Detail View">
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon/03-detail-large.jpg" 
     alt="Copper Tea Spoon - Side View">
```

---

## 📏 Image Size Specifications

### Featured Items (Mega-Menu)
- **Small**: 400×400px (square)
- **Medium**: 600×600px (square) - **PRIMARY SIZE**
- **Large**: 800×800px (square)

### Category Hero Images
- **Small**: 800×600px (4:3 ratio)
- **Medium**: 1200×800px (3:2 ratio)
- **Large**: 1920×1080px (16:9 ratio)

### Subcategory Preview Cards
- **Small**: 400×400px (square)
- **Medium**: 800×800px (square) - **PRIMARY SIZE**
- **Large**: 1200×1200px (square)

### Product Cards (Listing Pages)
- **Small**: 400×400px (square)
- **Medium**: 800×800px (square) - **PRIMARY SIZE**
- **Large**: 1200×1200px (square)

### Product Detail Page Images
- **Small**: 400×400px (square) - thumbnail
- **Medium**: 800×800px (square) - gallery
- **Large**: 1200×1200px (square) - main display

---

## 🎨 Current Categories & Subcategories

Based on your website structure:

### Copper Works
- Copper Spoons
- Copper Ladles
- Copper Jewellery
- (Other copper subcategories)

### Weaving Tools
- Bodkins
- (Other weaving tool subcategories)

### Wands
- (Subcategories to be defined)

### Cat Toys
- (Subcategories to be defined)

### Knives
- (Subcategories to be defined)

---

## ✅ Quick Setup Checklist

When adding a new product:

1. **Create product folder**: `assets/images/products/[category]/[subcategory]/[product-name]/`
2. **Add main image**: `01-main-small.jpg`, `01-main-medium.jpg`, `01-main-large.jpg`
3. **Add detail images**: `02-detail-*.jpg`, `03-detail-*.jpg`, etc.
4. **Update subcategory preview** (if this is the featured product for the subcategory)
5. **Update featured items** (if this is a best-seller for mega-menu)
6. **Update HTML** with correct file paths

---

## 🔄 Migration from Current Structure

Your current structure uses folders like:
- `assets/images/Bodkins/Steel and walnut 1/`
- `assets/images/Ladles/#1/`
- `assets/images/Cat toys/`

**Recommended migration path**:
1. Keep current structure for now (backwards compatibility)
2. Gradually move to new structure as you add new products
3. Update HTML references as you migrate
4. Eventually deprecate old structure

**Or create aliases/symlinks** to map old paths to new structure.

---

## 📝 Example: Complete Product Setup

**Product**: Copper Tea Spoon (Small)

**File Structure**:
```
assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/
├── 01-main-small.jpg      (400×400px)
├── 01-main-medium.jpg     (800×800px)
├── 01-main-large.jpg      (1200×1200px)
├── 02-detail-small.jpg    (400×400px)
├── 02-detail-medium.jpg   (800×800px)
├── 02-detail-large.jpg    (1200×1200px)
├── 03-side-view-small.jpg (400×400px)
├── 03-side-view-medium.jpg (800×800px)
└── 03-side-view-large.jpg  (1200×1200px)
```

**HTML Usage**:
```html
<!-- On subcategory listing page -->
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-medium.jpg" 
     alt="Copper Tea Spoon (Small)">

<!-- On product detail page -->
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-large.jpg" 
     alt="Copper Tea Spoon (Small) - Main View">
<!-- Gallery -->
<img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/02-detail-large.jpg" 
     alt="Copper Tea Spoon (Small) - Detail">
```

---

## 🚀 Benefits of This Structure

1. **Easy to Navigate**: Clear hierarchy from category → subcategory → product
2. **Scalable**: Easy to add new products without cluttering
3. **Predictable Paths**: Code can generate paths based on product data
4. **Organized**: All related images in one place
5. **Maintainable**: Easy to find and update specific product images
6. **SEO-Friendly**: Descriptive folder and file names
7. **Responsive-Ready**: Multiple sizes for each image

---

## 📞 Questions?

Refer to this document when:
- Adding new products
- Organizing images
- Writing code to display images
- Migrating from old structure

**Last Updated**: Based on current website requirements
**Version**: 1.0

