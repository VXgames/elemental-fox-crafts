# Image Specifications Guide for Elemental Fox Crafts Website

## Overview
This document provides optimal dimensions, file sizes, and quality settings for all images used throughout the website.

**Important Notes:**
- **DPI**: Web images don't use traditional DPI. Focus on pixel dimensions. Save at 72-96 DPI for web (standard).
- **Format**: Use JPEG (.jpg) for photographs, PNG for graphics with transparency
- **Compression**: Optimize for web (quality 80-85% for JPEG)
- **Responsive Images**: The site uses responsive images with multiple sizes for performance

---

## 1. Hero Images (Home Page)

**Location**: Main hero section behind the content box

**Display Dimensions:**
- Full viewport width (up to 1920px on large screens)
- Full viewport height (minimum 90vh)

**File Dimensions (create 3 sizes):**
- **Small/Medium**: 800px width × 600px height (16:9 or 4:3 ratio)
- **Large**: 1200px width × 800px height
- **Extra Large** (optional): 1920px width × 1080px height

**Aspect Ratio**: 16:9 or 4:3 (horizontal)
**Format**: JPEG
**Quality**: 80-85%
**File Size Target**: 
- Small: 100-150 KB
- Large: 200-300 KB
- Extra Large: 400-500 KB

**Current srcset**: 800w, 1200w

---

## 2. Product Card Images (Customer Favorites, Shop Pages)

**Location**: Product grid on home page and shop pages

**Display Dimensions:**
- Desktop: ~400px × 400px (square)
- Mobile: Full width of card (responsive)

**File Dimensions (create 3 sizes):**
- **Small**: 400px × 400px (1:1 square)
- **Medium**: 800px × 800px (1:1 square)
- **Large**: 1200px × 1200px (1:1 square) - for high-DPI displays

**Aspect Ratio**: 1:1 (square, mandatory)
**Format**: JPEG
**Quality**: 80-85%
**File Size Target**:
- Small: 50-80 KB
- Medium: 100-150 KB
- Large: 200-300 KB

**Current srcset**: 400w, 800w, 1200w
**Naming Convention**: `filename-small.jpg`, `filename-medium.jpg`, `filename-large.jpg`

---

## 3. Mega Dropdown Preview Cards (Shop Menu)

**Location**: Three preview cards in the Shop mega dropdown menu

**Display Dimensions:**
- Desktop: Approximately 250-300px × 250-300px (square, varies with screen size)
- Container max-width: 1400px (three cards in a grid with gaps)

**File Dimensions (create 2-3 sizes):**
- **Small/Medium**: 600px × 600px (1:1 square) - **RECOMMENDED PRIMARY SIZE**
- **Large**: 800px × 800px (1:1 square) - for high-DPI displays

**Aspect Ratio**: 1:1 (square, mandatory)
**Format**: JPEG
**Quality**: 80-85%
**File Size Target**:
- Medium: 80-120 KB
- Large: 150-200 KB

**Current Implementation**: Uses `-medium.JPG` files
**Naming Convention**: Use `filename-medium.jpg` or `filename.JPG` (as currently used)

---

## 4. Category Page Images

**Location**: Category listing pages (e.g., category-copper.html, category-wands.html)

**Display Dimensions:**
- Similar to product cards: square images in a grid
- Desktop: ~400px × 400px
- Mobile: Full width responsive

**File Dimensions**: Same as Product Card Images
- **Small**: 400px × 400px
- **Medium**: 800px × 800px
- **Large**: 1200px × 1200px

**Same specifications as Product Card Images**

---

## 5. About/Contact Page Images

**Location**: About page image placeholder, contact page

**Display Dimensions:**
- Desktop: Half of content width (max ~600px wide)
- Mobile: Full width

**File Dimensions:**
- **Recommended**: 1200px width × variable height (maintain aspect ratio)
- **Aspect Ratio**: 4:3 or 16:9 (flexible)
- **Format**: JPEG
**Quality**: 80-85%
**File Size Target**: 200-300 KB

---

## 6. Logo

**Location**: Header navigation

**Current File**: `VectorFoxwhite.png`
**Dimensions**: Current size works well (scaled to 3.5rem height)
**Format**: PNG (for transparency) or SVG (preferred for scalability)
**Recommended**: 
- **PNG**: 200px × 200px (if using raster)
- **SVG**: Vector format (scales infinitely, preferred)

---

## Summary Table

| Image Type | Aspect Ratio | Small Size | Medium Size | Large Size | Primary Use |
|------------|--------------|------------|-------------|------------|-------------|
| Hero Image | 16:9 or 4:3 | 800×600 | 1200×800 | 1920×1080 | Home page background |
| Product Cards | 1:1 (square) | 400×400 | 800×800 | 1200×1200 | Product grids |
| Mega Menu Cards | 1:1 (square) | - | 600×600 | 800×800 | Dropdown preview |
| Category Images | 1:1 (square) | 400×400 | 800×800 | 1200×1200 | Category pages |
| About/Contact | 4:3 or 16:9 | - | 1200×900 | - | Content images |

---

## Optimization Tips

1. **Always create square images for products** - The site uses 1:1 aspect ratio for all product/preview images
2. **Crop before uploading** - Ensure images are properly cropped to the required aspect ratios
3. **Use image optimization tools**:
   - Online: TinyPNG, Squoosh
   - Software: Photoshop "Save for Web", ImageOptim, GIMP
4. **File naming**: Use descriptive names with size suffixes (e.g., `bodkin-walnut-medium.jpg`)
5. **Alt text**: Always provide descriptive alt text for accessibility

---

## Quick Reference: Most Important Sizes

**For immediate use, focus on these sizes:**

1. **Mega Dropdown Preview Cards**: 600px × 600px (square) - **PRIORITY**
2. **Product Cards**: 800px × 800px (square)
3. **Hero Images**: 1200px width (maintain aspect ratio)
4. **Category Images**: 800px × 800px (square)

---

## DPI/Resolution Guidelines

- **Standard Web Display**: 72 DPI (this is just metadata, doesn't affect web display)
- **High-DPI/Retina Displays**: Provide 2x resolution images (e.g., 800px image for 400px display)
- **What matters**: Pixel dimensions, not DPI for web
- **Best Practice**: Save images at 72-96 DPI, but focus on pixel dimensions

---

## Current File Structure Example

```
assets/images/
├── Bodkins/
│   └── Steel and walnut 1/
│       ├── 001-small.JPG (400×400)
│       ├── 001-medium.JPG (800×800)
│       └── 001-large.JPG (1200×1200)
├── Wands/
│   └── Cherry 1/
│       ├── IMG_3520-small.JPG
│       ├── IMG_3520-medium.JPG
│       └── IMG_3520-large.JPG
└── Ladles/
    └── #1/
        ├── IMG_1004-small.jpg
        ├── IMG_1004-medium.jpg
        └── IMG_1004-large.jpg
```

---

**Last Updated**: Based on current website implementation
**Contact**: Refer to this document when preparing images for the website

