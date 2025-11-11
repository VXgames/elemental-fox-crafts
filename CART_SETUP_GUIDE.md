# Shopping Cart Setup Guide

## Overview
A complete shopping cart system has been implemented for your website. This guide explains how to set it up and use it.

## Features
- ✅ Shopping cart sidebar with add/remove/update quantities
- ✅ Cart icon in header with item count badge
- ✅ Persistent cart storage (localStorage)
- ✅ Checkout page with customer information form
- ✅ Email notifications for orders (via EmailJS)
- ✅ Responsive design (mobile-friendly)
- ✅ All "Add to Cart" buttons are functional

## Files Created
1. **`assets/js/cart.js`** - Cart functionality and localStorage management
2. **`assets/js/checkout.js`** - Checkout page handler and email sending
3. **`checkout.html`** - Checkout page with customer form
4. **Cart CSS** - Added to `style.css` (cart styles section)

## Adding Cart to All Pages

### Required HTML Structure
Each HTML page needs:
1. Cart toggle button in header (before Instagram icon)
2. Cart overlay and sidebar HTML
3. Cart JavaScript file included

### Step 1: Add Cart Button to Header
Add this button before the Instagram icon in the `<header>`:

```html
<button class="cart-toggle" aria-label="Open shopping cart">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span class="cart-badge">0</span>
</button>
```

### Step 2: Add Cart HTML Structure
Add this after the `</header>` tag:

```html
<!-- Cart Overlay -->
<div class="cart-overlay"></div>

<!-- Cart Sidebar -->
<div class="cart-sidebar">
    <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="cart-close" aria-label="Close cart">×</button>
    </div>
    <div class="cart-content">
        <div class="cart-empty">
            <p>Your cart is empty</p>
            <p style="font-size: 0.9rem; color: var(--muted);">Add items to get started</p>
        </div>
        <div class="cart-items">
            <!-- Cart items will be dynamically added here -->
        </div>
    </div>
    <div class="cart-footer">
        <div class="cart-total">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-amount">$0.00</span>
        </div>
        <button class="cart-checkout-btn">Proceed to Checkout</button>
    </div>
</div>
```

### Step 3: Add Cart JavaScript
Add this script before the closing `</body>` tag (after other scripts):

```html
<script src="./assets/js/cart.js"></script>
```

## Email Setup (EmailJS)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy your Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Subject: New Order from Elemental Fox Crafts

New Order Received

Customer Information:
Name: {{customer_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}

Shipping Address:
{{customer_address}}
{{customer_city}}, {{customer_state}} {{customer_zip}}
{{customer_country}}

Order Notes:
{{customer_notes}}

Order Details:
{{order_items}}

Order Total: {{order_total}}

Order Date: {{order_date}}
```

4. **Copy your Template ID** (you'll need this)

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key**

### Step 5: Update checkout.html
Open `checkout.html` and update these values:

1. **Public Key** (line ~18):
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your Public Key
```

2. **Service ID and Template ID** (in `assets/js/checkout.js`, around line ~85):
```javascript
const response = await emailjs.send(
    'YOUR_SERVICE_ID',  // Replace with your Service ID
    'YOUR_TEMPLATE_ID', // Replace with your Template ID
    emailParams
);
```

3. **Your Email Address** (in `assets/js/checkout.js`, around line ~70):
```javascript
to_email: 'YOUR_EMAIL@example.com', // Replace with your email
```

## Testing the Cart

### Test Adding Items
1. Open any product page
2. Click "Add to Cart"
3. Cart icon should show item count
4. Click cart icon to open sidebar
5. Verify item appears in cart

### Test Checkout
1. Add items to cart
2. Click "Proceed to Checkout"
3. Fill out customer form
4. Submit order
5. Check your email for order notification

## Troubleshooting

### Cart Not Appearing
- Check that `cart.js` is included in HTML
- Check browser console for errors
- Verify cart HTML structure is present

### Email Not Sending
- Verify EmailJS Public Key is set
- Verify Service ID and Template ID are correct
- Check EmailJS dashboard for error logs
- Verify email template variables match the code

### Items Not Adding to Cart
- Check browser console for errors
- Verify product data has required fields (name, price, image)
- Check that `window.addToCart` function is available

## Cart Data Structure

Products in JSON files should have:
- `id` (optional but recommended)
- `name` (required)
- `price` (required, format: "$XX.XX")
- `image` (required)
- `alt` (optional, defaults to name)

## Notes
- Cart data is stored in browser localStorage
- Cart persists across page refreshes
- Cart is cleared after successful checkout
- Email notifications require EmailJS setup
- Free EmailJS account allows 200 emails/month

