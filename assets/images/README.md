# Images Directory Structure

This directory contains all images for the Elemental Fox Crafts website, organized for easy management and code integration.

## 📁 Folder Structure

```
assets/images/
├── featured/              # Mega-menu featured items (3 best sellers)
├── categories/            # Category hero images
└── products/              # All product images
    ├── copper-works/      # Copper Works products
    ├── weaving-tools/     # Weaving Tools products
    ├── wands/             # Wands products
    ├── cat-toys/          # Cat Toys products
    └── knives/            # Knives products
```

## 🎯 Quick Start

1. **Featured Items**: Add 3 best-selling items to `featured/` folder
2. **Category Heroes**: Add hero images to `categories/` folder
3. **Products**: Organize products by category → subcategory → product

## 📋 Image Specifications

### Featured Items (Mega-Menu)
- **Size**: 600×600px (square)
- **File Size**: 80-120 KB
- **Format**: JPEG

### Category Heroes
- **Size**: 1200×800px (landscape)
- **File Size**: 200-300 KB
- **Format**: JPEG

### Product Images
- **Listing Pages**: 800×800px (square), 100-150 KB
- **Detail Pages**: 1200×1200px (square), 200-300 KB
- **Format**: JPEG
- **Quality**: 80-85%

## 📖 Documentation

- See individual README files in each folder for specific instructions
- See `IMAGE_STRUCTURE_SIMPLIFIED.md` in project root for complete guide
- See `IMAGE_STRUCTURE_QUICK_REFERENCE.md` for quick lookup

## ✅ Naming Conventions

- Use **kebab-case** for folders and files: `copper-tea-spoon.jpg`
- Product images: `01-main.jpg`, `02-detail.jpg`, `03-side-view.jpg`
- Subcategory previews: `subcategory-preview.jpg`
- Category heroes: `category-name.jpg`

## 🚀 Adding a New Product

1. Create folder: `products/[category]/[subcategory]/[product-name]/`
2. Add images: `01-main.jpg`, `02-detail.jpg`, etc.
3. Update HTML with correct paths
4. Done!

## 📞 Need Help?

Refer to the documentation files in the project root:
- `IMAGE_FILE_STRUCTURE.md` - Complete structure guide
- `IMAGE_STRUCTURE_SIMPLIFIED.md` - Simplified single-size approach
- `IMAGE_STRUCTURE_EXAMPLE.md` - Step-by-step examples
- `IMAGE_STRUCTURE_QUICK_REFERENCE.md` - Quick reference

