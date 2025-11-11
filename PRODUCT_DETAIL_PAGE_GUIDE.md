# Product Detail Page Guide

## Overview
Individual product pages have been implemented with image galleries, detailed product information, and a message/request box for custom orders.

## Files Created
- `product-detail.html` - Product detail page template
- `assets/js/product-detail-loader.js` - Script to load and display product data
- Updated `assets/js/cart.js` - Now handles custom messages with cart items
- Updated `assets/js/checkout.js` - Includes messages in order emails
- Updated `assets/js/subcategory-loader.js` - Creates links to product detail pages
- Updated `style.css` - Added styling for product detail pages

## How It Works

### URL Structure
Product pages can be accessed via:
- `product-detail.html?id=1&slug=steel-walnut-bodkin-001`
- The script searches all product JSON files to find the matching product by ID or slug

### Product JSON Structure
To enable product detail pages, update your product JSON files to include:

```json
{
  "subcategory": {
    "name": "Bodkins",
    "description": "Essential weaving tools..."
  },
  "products": [
    {
      "id": 1,
      "name": "Steel & Walnut Bodkin",
      "slug": "steel-walnut-bodkin-001",  // Optional: for SEO-friendly URLs
      "price": "$24.00",
      "description": "Brief description for listing pages",
      "fullDescription": "Detailed description for product page. This can include multiple paragraphs and more information about the product.",
      "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-medium.jpg",
      "imageSmall": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-small.jpg",
      "imageLarge": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-large.jpg",
      "alt": "Steel and Walnut Bodkin #001",
      "gallery": [
        {
          "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\02-detail-large.jpg",
          "small": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\02-detail-small.jpg",
          "large": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\02-detail-large.jpg",
          "alt": "Steel and Walnut Bodkin #001 - Detail view"
        },
        {
          "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\03-detail-large.jpg",
          "small": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\03-detail-small.jpg",
          "large": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\03-detail-large.jpg",
          "alt": "Steel and Walnut Bodkin #001 - Side view"
        }
      ],
      "material": "Steel and Walnut",
      "dimensions": "6.5\" x 0.5\"",
      "availability": "In Stock",
      "link": "product-detail.html?id=1&slug=steel-walnut-bodkin-001"  // Optional: custom link
    }
  ]
}
```

### Required Fields
- `id` - Unique product identifier (used for URL matching)
- `name` - Product name
- `price` - Product price (string format: "$24.00")
- `image` or `imageLarge` - Main product image
- `alt` - Image alt text

### Optional Fields
- `slug` - URL-friendly identifier (auto-generated from name if not provided)
- `description` - Brief description for listing pages
- `fullDescription` - Detailed description for product page
- `gallery` - Array of additional images
- `material` - Product materials
- `dimensions` - Product dimensions
- `availability` - Stock status
- `link` - Custom product page URL

### Gallery Images
The `gallery` array should contain objects with:
- `image` or `large` - Full-size image path
- `small` or `thumbnail` - Thumbnail image path
- `alt` - Image alt text

Images are displayed in a scrollable gallery with thumbnails. Users can:
- Click thumbnails to change the main image
- Use arrow buttons to navigate
- Use keyboard arrows (← →) to navigate

## Features

### Image Gallery
- Main image display with navigation buttons
- Thumbnail gallery below main image
- Keyboard navigation (arrow keys)
- Click thumbnails to change main image
- Responsive design for mobile

### Custom Messages
- Textarea for special requests or messages
- Character counter (500 character limit)
- Messages are saved with cart items
- Displayed in cart, checkout, and order emails

### Product Information
- Product title and price
- Full description
- Additional information (material, dimensions, availability)
- Breadcrumb navigation

### Add to Cart
- Adds product with custom message (if provided)
- Opens cart on mobile after adding
- Shows success notification
- Messages are preserved when adding multiple quantities

## Updating Existing Products

To add product detail pages to existing products:

1. **Update JSON Files**
   - Add `fullDescription` field for detailed descriptions
   - Add `gallery` array with additional images
   - Add optional fields like `material`, `dimensions`, `availability`
   - Ensure each product has a unique `id`

2. **Add Gallery Images**
   - Place images in the product folder (e.g., `steel-walnut-bodkin-001/`)
   - Name them sequentially: `02-detail-large.jpg`, `03-detail-large.jpg`, etc.
   - Create thumbnails: `02-detail-small.jpg`, `03-detail-small.jpg`, etc.

3. **Update Links**
   - The `subcategory-loader.js` automatically creates product detail links
   - Links use format: `product-detail.html?id={id}&slug={slug}`
   - You can override with a custom `link` field in JSON

## Example: Updating product-bodkins.json

```json
{
  "products": [
    {
      "id": 1,
      "name": "Steel & Walnut Bodkin",
      "price": "$24.00",
      "description": "Handcrafted bodkin with steel tip and walnut handle.",
      "fullDescription": "This beautifully crafted bodkin features a durable steel tip and a smooth walnut handle. Perfect for weaving projects, each bodkin is hand-finished for quality and precision. The ergonomic design ensures comfortable use during long weaving sessions.",
      "image": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-medium.jpg",
      "imageSmall": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-small.jpg",
      "imageLarge": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\01-main-large.jpg",
      "alt": "Steel and Walnut Bodkin #001",
      "gallery": [
        {
          "large": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\02-detail-large.jpg",
          "small": ".\\assets\\images\\products\\weaving-tools\\bodkins\\steel-walnut-bodkin-001\\02-detail-small.jpg",
          "alt": "Steel and Walnut Bodkin #001 - Detail view"
        }
      ],
      "material": "Steel, Walnut",
      "dimensions": "6.5\" length",
      "availability": "In Stock"
    }
  ]
}
```

## Testing

1. **Test Product Page Loading**
   - Navigate to a product listing page (e.g., `product-bodkins.html`)
   - Click "View Details" on a product
   - Verify product information loads correctly

2. **Test Image Gallery**
   - Click thumbnails to change main image
   - Use arrow buttons to navigate
   - Use keyboard arrows to navigate
   - Verify images load correctly

3. **Test Custom Messages**
   - Add a product to cart with a message
   - Verify message appears in cart
   - Complete checkout and verify message in order email

4. **Test Mobile Responsiveness**
   - View product page on mobile device
   - Verify gallery works on touch devices
   - Verify layout is responsive

## Troubleshooting

### Product Not Found
- Verify product `id` matches URL parameter
- Check that product exists in one of the JSON files
- Verify JSON file is valid (no syntax errors)

### Images Not Loading
- Verify image paths are correct (Windows paths are auto-converted)
- Check that image files exist in the specified locations
- Verify image file names match JSON paths

### Gallery Not Working
- Verify `gallery` array is properly formatted in JSON
- Check browser console for JavaScript errors
- Ensure `product-detail-loader.js` is loaded

### Messages Not Saving
- Verify `cart.js` is loaded
- Check browser console for errors
- Verify message is included when calling `addToCart()`

## Next Steps

1. Update all product JSON files with gallery images and detailed descriptions
2. Add gallery images for each product
3. Test all product detail pages
4. Update SEO meta tags for each product (currently uses product data)
5. Consider adding product reviews or ratings
6. Add related products section
7. Add product sharing functionality

