# Image File Structure - Complete Example

## 📝 Step-by-Step: Adding a New Product

This guide walks you through adding a complete product from start to finish.

---

## Example: Adding "Copper Tea Spoon (Small)"

### Step 1: Create Folder Structure

```
assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/
```

**Full path**: `assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/`

---

### Step 2: Add Product Images

Place your images in the product folder with these names:

```
copper-tea-spoon-small/
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

---

### Step 3: Update Subcategory Preview (if needed)

If this is the featured product for "Copper Spoons" subcategory, update:

```
assets/images/products/copper-works/copper-spoons/subcategory-preview-medium.jpg
```

Use the same image as `01-main-medium.jpg` or a different representative image.

---

### Step 4: Update HTML Files

#### A. Subcategory Listing Page (product-copper-spoons.html)

Add product card:

```html
<div class="product-card">
    <a href="product-copper-tea-spoon-small.html" class="product-link">
        <div class="product-image">
            <img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-medium.jpg" 
                 alt="Copper Tea Spoon (Small)"
                 srcset="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-small.jpg 400w,
                         ./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-medium.jpg 800w,
                         ./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-large.jpg 1200w"
                 sizes="(max-width: 768px) 100vw, 400px">
        </div>
        <h3>Copper Tea Spoon (Small)</h3>
        <div class="price">$25.00</div>
        <div class="stars">★ ★ ★ ★ ★</div>
    </a>
</div>
```

#### B. Product Detail Page (product-copper-tea-spoon-small.html)

Main product image and gallery:

```html
<!-- Main Product Image -->
<div class="product-main-image">
    <img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-large.jpg" 
         alt="Copper Tea Spoon (Small) - Main View"
         id="main-product-image">
</div>

<!-- Product Gallery -->
<div class="product-gallery">
    <img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/01-main-large.jpg" 
         alt="Copper Tea Spoon (Small) - Main View"
         class="gallery-thumbnail"
         onclick="changeMainImage(this.src)">
    
    <img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/02-detail-large.jpg" 
         alt="Copper Tea Spoon (Small) - Detail View"
         class="gallery-thumbnail"
         onclick="changeMainImage(this.src)">
    
    <img src="./assets/images/products/copper-works/copper-spoons/copper-tea-spoon-small/03-side-view-large.jpg" 
         alt="Copper Tea Spoon (Small) - Side View"
         class="gallery-thumbnail"
         onclick="changeMainImage(this.src)">
</div>
```

---

## 🎯 Complete Example: Full Product Setup

### Product Information
- **Name**: Copper Tea Spoon (Small)
- **Category**: Copper Works
- **Subcategory**: Copper Spoons
- **Price**: $25.00
- **SKU**: CTS-SM-001

### File Structure Created

```
assets/images/
├── products/
│   └── copper-works/
│       └── copper-spoons/
│           ├── subcategory-preview-medium.jpg  (Updated if this is featured)
│           └── copper-tea-spoon-small/
│               ├── 01-main-small.jpg
│               ├── 01-main-medium.jpg
│               ├── 01-main-large.jpg
│               ├── 02-detail-small.jpg
│               ├── 02-detail-medium.jpg
│               ├── 02-detail-large.jpg
│               ├── 03-side-view-small.jpg
│               ├── 03-side-view-medium.jpg
│               └── 03-side-view-large.jpg
```

### HTML Files Updated

1. **product-copper-spoons.html** - Added product card to listing
2. **product-copper-tea-spoon-small.html** - Created product detail page

---

## 🔄 Example: Adding to Mega-Menu

If this product becomes a best-seller and should appear in the mega-menu:

### Step 1: Create Featured Item Folder

```
assets/images/featured/copper-tea-spoon-small/
```

### Step 2: Add Preview Images

```
copper-tea-spoon-small/
├── preview-small.jpg   (400×400px)
├── preview-medium.jpg  (600×600px)  ← Used in mega-menu
└── preview-large.jpg   (800×800px)
```

**Note**: You can copy/resize from `01-main-medium.jpg` or use a different optimized image.

### Step 3: Update HTML (index.html and all pages)

```html
<!-- In mega-menu -->
<div class="preview-card">
    <div class="preview-image">
        <img src="./assets/images/featured/copper-tea-spoon-small/preview-medium.jpg" 
             alt="Copper Tea Spoon (Small)">
    </div>
    <h4>Copper Tea Spoon (Small)</h4>
    <div class="price">$25.00</div>
    <div class="stars">★ ★ ★ ★ ★</div>
    <div class="color-dots">
        <span class="color-dot" style="background:#b87333"></span>
    </div>
</div>
```

---

## 📋 Template: Product Folder Structure

Use this template when creating any new product:

```
assets/images/products/
└── [category-name]/              (e.g., copper-works)
    └── [subcategory-name]/       (e.g., copper-spoons)
        ├── subcategory-preview-medium.jpg  (if updating)
        └── [product-name]/       (e.g., copper-tea-spoon-small)
            ├── 01-main-small.jpg
            ├── 01-main-medium.jpg
            ├── 01-main-large.jpg
            ├── 02-detail-small.jpg
            ├── 02-detail-medium.jpg
            ├── 02-detail-large.jpg
            ├── 03-[view]-small.jpg
            ├── 03-[view]-medium.jpg
            └── 03-[view]-large.jpg
```

---

## 🎨 Image Preparation Checklist

Before adding images to the website:

- [ ] **Crop to square** (1:1 ratio) for product images
- [ ] **Resize to correct dimensions**:
  - Small: 400×400px
  - Medium: 800×800px
  - Large: 1200×1200px
- [ ] **Optimize file size**:
  - Small: 50-80 KB
  - Medium: 100-150 KB
  - Large: 200-300 KB
- [ ] **Use descriptive filenames**: `01-main-medium.jpg`, `02-detail-medium.jpg`
- [ ] **Save as JPEG** with 80-85% quality
- [ ] **Ensure consistent lighting** and background across images

---

## 🔗 Path Reference Cheat Sheet

### Quick Path Templates

```javascript
// Mega-Menu Featured Item
`./assets/images/featured/${itemName}/preview-medium.jpg`

// Category Hero
`./assets/images/categories/${categoryName}/hero-medium.jpg`

// Subcategory Preview
`./assets/images/products/${categoryName}/${subcategoryName}/subcategory-preview-medium.jpg`

// Product Card (Listing)
`./assets/images/products/${categoryName}/${subcategoryName}/${productName}/01-main-medium.jpg`

// Product Detail (Main Image)
`./assets/images/products/${categoryName}/${subcategoryName}/${productName}/01-main-large.jpg`

// Product Detail (Gallery)
`./assets/images/products/${categoryName}/${subcategoryName}/${productName}/${imageNumber}-detail-large.jpg`
```

---

## ✅ Complete Setup Checklist

When adding a new product:

### Folder Structure
- [ ] Create category folder (if doesn't exist)
- [ ] Create subcategory folder (if doesn't exist)
- [ ] Create product folder
- [ ] Add all image sizes (small, medium, large)

### Images
- [ ] Main image (01-main-*.jpg)
- [ ] Detail images (02-detail-*.jpg, 03-detail-*.jpg, etc.)
- [ ] All sizes created (small, medium, large)
- [ ] Images optimized for web

### HTML Updates
- [ ] Add product card to subcategory listing page
- [ ] Create product detail page
- [ ] Add gallery images to product detail page
- [ ] Update subcategory preview (if featured)
- [ ] Update mega-menu (if best-seller)

### Testing
- [ ] Test product card display
- [ ] Test product detail page
- [ ] Test image gallery
- [ ] Test responsive images (mobile, tablet, desktop)
- [ ] Verify all image paths are correct

---

## 🚀 Quick Start: Copy This Structure

1. **Copy the folder structure** from the template above
2. **Replace placeholders**:
   - `[category-name]` → e.g., `copper-works`
   - `[subcategory-name]` → e.g., `copper-spoons`
   - `[product-name]` → e.g., `copper-tea-spoon-small`
3. **Add your images** with correct naming
4. **Update HTML** with correct paths
5. **Test** on the website

---

**See other documentation files for:**
- Complete structure overview: `IMAGE_FILE_STRUCTURE.md`
- Quick reference: `IMAGE_STRUCTURE_QUICK_REFERENCE.md`
- Visual diagram: `IMAGE_STRUCTURE_DIAGRAM.md`

