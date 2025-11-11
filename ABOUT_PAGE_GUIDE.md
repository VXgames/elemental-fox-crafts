# About Page Content Guide

## Overview
The About page content is now managed through a JSON file, making it easy to update text and images without editing HTML.

## File Location
- **JSON Data**: `assets/data/about.json`
- **Loader Script**: `assets/js/about-loader.js`
- **HTML Page**: `about.html`

## How to Edit Content

### 1. Edit the JSON File
Open `assets/data/about.json` and modify the content:

```json
{
  "page": {
    "title": "About Elemental Fox Crafts",
    "sections": [
      {
        "type": "text",
        "content": "Your first paragraph text here."
      },
      {
        "type": "text",
        "content": "Your second paragraph text here."
      }
    ],
    "image": {
      "path": ".\\assets\\images\\about\\workspace.jpg",
      "alt": "Elemental Fox Crafts workspace"
    }
  }
}
```

### 2. Adding More Paragraphs
Add more objects to the `sections` array:

```json
"sections": [
  {
    "type": "text",
    "content": "First paragraph."
  },
  {
    "type": "text",
    "content": "Second paragraph."
  },
  {
    "type": "text",
    "content": "Third paragraph."
  }
]
```

### 3. Updating the Image
Change the image path in the `image` object:

```json
"image": {
  "path": ".\\assets\\images\\about\\your-image.jpg",
  "alt": "Description of your image"
}
```

**Note**: You can use Windows-style paths (with backslashes) - they will be automatically converted to web paths.

### 4. Removing the Image
If you don't want an image, you can either:
- Set `"path": ""` (empty string)
- Or remove the entire `"image"` object from the JSON

## Image Path Format
You can copy and paste Windows file paths directly:
- ✅ `.\\assets\\images\\about\\workspace.jpg`
- ✅ `assets\\images\\about\\workspace.jpg`
- ✅ `./assets/images/about/workspace.jpg` (web format also works)

The loader automatically converts backslashes to forward slashes.

## File Structure
Place your about page images in:
```
assets/images/about/
  └── workspace.jpg (or your image name)
```

## Tips
- Each paragraph should be a separate object in the `sections` array
- The `alt` text for images is important for accessibility
- Changes to the JSON file will automatically appear on the page (refresh to see)

