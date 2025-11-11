# Image File Structure - Visual Diagram

## 🗂️ Complete Structure Overview

```
assets/images/
│
├── 📁 featured/                    ⭐ MEGA-MENU (3 best sellers)
│   │
│   ├── 📁 item-01/                (e.g., walnut-steel-bodkin)
│   │   ├── 📄 preview-small.jpg
│   │   ├── 📄 preview-medium.jpg  ← Used in mega-menu
│   │   └── 📄 preview-large.jpg
│   │
│   ├── 📁 item-02/                (e.g., cherry-wood-wand)
│   │   └── [same structure]
│   │
│   └── 📁 item-03/                (e.g., natural-cat-wand)
│       └── [same structure]
│
├── 📁 categories/                  🏷️ CATEGORY HERO IMAGES
│   │
│   ├── 📁 copper-works/
│   │   ├── 📄 hero-small.jpg
│   │   ├── 📄 hero-medium.jpg     ← Used on category-copper.html
│   │   └── 📄 hero-large.jpg
│   │
│   ├── 📁 weaving-tools/
│   │   └── [same structure]
│   │
│   ├── 📁 wands/
│   │   └── [same structure]
│   │
│   └── 📁 [other-categories]/
│       └── [same structure]
│
└── 📁 products/                    🛍️ ALL PRODUCT IMAGES
    │
    ├── 📁 copper-works/            📂 CATEGORY LEVEL
    │   │
    │   ├── 📁 copper-spoons/       📂 SUBCATEGORY LEVEL
    │   │   ├── 📄 subcategory-preview-medium.jpg  ← Used on category-copper.html
    │   │   │
    │   │   ├── 📁 copper-tea-spoon/  📂 PRODUCT LEVEL
    │   │   │   ├── 📄 01-main-small.jpg
    │   │   │   ├── 📄 01-main-medium.jpg     ← Used on subcategory listing
    │   │   │   ├── 📄 01-main-large.jpg      ← Used on product detail page
    │   │   │   ├── 📄 02-detail-small.jpg
    │   │   │   ├── 📄 02-detail-medium.jpg
    │   │   │   ├── 📄 02-detail-large.jpg    ← Used on product detail gallery
    │   │   │   ├── 📄 03-detail-small.jpg
    │   │   │   ├── 📄 03-detail-medium.jpg
    │   │   │   └── 📄 03-detail-large.jpg
    │   │   │
    │   │   ├── 📁 copper-coffee-scoop/
    │   │   │   └── [same structure]
    │   │   │
    │   │   └── 📁 [other-products]/
    │   │       └── [same structure]
    │   │
    │   ├── 📁 copper-ladles/       📂 SUBCATEGORY LEVEL
    │   │   ├── 📄 subcategory-preview-medium.jpg
    │   │   ├── 📁 small-copper-ladle/
    │   │   │   └── [same structure]
    │   │   └── 📁 large-copper-ladle/
    │   │       └── [same structure]
    │   │
    │   └── 📁 copper-jewellery/    📂 SUBCATEGORY LEVEL
    │       ├── 📄 subcategory-preview-medium.jpg
    │       └── 📁 [products]/
    │           └── [same structure]
    │
    ├── 📁 weaving-tools/           📂 CATEGORY LEVEL
    │   │
    │   └── 📁 bodkins/             📂 SUBCATEGORY LEVEL
    │       ├── 📄 subcategory-preview-medium.jpg
    │       ├── 📁 walnut-steel-bodkin/
    │       │   └── [same structure]
    │       └── 📁 cherry-bodkin/
    │           └── [same structure]
    │
    ├── 📁 wands/                   📂 CATEGORY LEVEL
    │   └── 📁 [subcategories]/
    │       └── 📁 [products]/
    │           └── [same structure]
    │
    ├── 📁 cat-toys/                📂 CATEGORY LEVEL
    │   └── 📁 [subcategories]/
    │       └── 📁 [products]/
    │           └── [same structure]
    │
    └── 📁 knives/                  📂 CATEGORY LEVEL
        └── 📁 [subcategories]/
            └── 📁 [products]/
                └── [same structure]
```

---

## 🔄 Image Flow Through Website

### 1. Home Page → Mega-Menu
```
User hovers over "Shop" button
    ↓
Mega-menu displays 3 featured items
    ↓
Images loaded from: assets/images/featured/[item-name]/preview-medium.jpg
```

### 2. Category Page (e.g., category-copper.html)
```
User clicks "Copper Works" category
    ↓
Category page displays:
    - Hero image: assets/images/categories/copper-works/hero-medium.jpg
    - Subcategory cards: assets/images/products/copper-works/[subcategory]/subcategory-preview-medium.jpg
```

### 3. Subcategory Page (e.g., product-copper-spoons.html)
```
User clicks "Copper Spoons" subcategory
    ↓
Subcategory page displays:
    - Product cards: assets/images/products/copper-works/copper-spoons/[product-name]/01-main-medium.jpg
```

### 4. Product Detail Page (e.g., product-copper-tea-spoon.html)
```
User clicks on a specific product
    ↓
Product detail page displays:
    - Main image: assets/images/products/copper-works/copper-spoons/copper-tea-spoon/01-main-large.jpg
    - Gallery images: assets/images/products/copper-works/copper-spoons/copper-tea-spoon/02-detail-large.jpg
    - Additional images: assets/images/products/copper-works/copper-spoons/copper-tea-spoon/03-detail-large.jpg
```

---

## 📊 Structure Hierarchy

```
LEVEL 1: CATEGORY
    │
    ├── LEVEL 2: SUBCATEGORY
    │       │
    │       ├── LEVEL 3: PRODUCT
    │       │       │
    │       │       └── LEVEL 4: IMAGES
    │       │               ├── 01-main-*.jpg
    │       │               ├── 02-detail-*.jpg
    │       │               └── 03-detail-*.jpg
    │       │
    │       └── subcategory-preview-*.jpg
    │
    └── [category]/hero-*.jpg (in categories/ folder)
```

---

## 🎯 Usage Map

| Where Used | Image Source | Size |
|------------|--------------|------|
| **Mega-Menu** | `featured/[item]/preview-medium.jpg` | 600×600px |
| **Category Hero** | `categories/[category]/hero-medium.jpg` | 1200×800px |
| **Subcategory Card** | `products/[cat]/[subcat]/subcategory-preview-medium.jpg` | 800×800px |
| **Product Card (List)** | `products/[cat]/[subcat]/[product]/01-main-medium.jpg` | 800×800px |
| **Product Detail (Main)** | `products/[cat]/[subcat]/[product]/01-main-large.jpg` | 1200×1200px |
| **Product Detail (Gallery)** | `products/[cat]/[subcat]/[product]/02-detail-large.jpg` | 1200×1200px |

---

## 💡 Key Points

1. **Featured Items**: 3 best sellers in `featured/` folder
2. **Category Heroes**: One per category in `categories/` folder
3. **Subcategory Previews**: One per subcategory in `products/[category]/[subcategory]/`
4. **Product Images**: Multiple per product in `products/[category]/[subcategory]/[product]/`
5. **All Product Images**: Square (1:1 ratio) except category heroes
6. **Naming**: Always include size suffix (-small, -medium, -large)
7. **Numbering**: Use two-digit numbers (01, 02, 03) for proper sorting

---

## 🚀 Getting Started

1. **Create folder structure** for your category
2. **Add category hero** to `categories/[category]/`
3. **Create subcategory folders** in `products/[category]/`
4. **Add subcategory preview** images
5. **Create product folders** for each product
6. **Add product images** (main + details)
7. **Update HTML** with correct paths

---

**See `IMAGE_FILE_STRUCTURE.md` for complete documentation.**
**See `IMAGE_STRUCTURE_QUICK_REFERENCE.md` for quick lookup.**

