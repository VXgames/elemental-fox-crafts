# Adding Cart to All HTML Pages

This document lists which pages need the cart structure added.

## Pages That Need Cart Structure

All HTML pages in the root directory need:
1. Cart toggle button in header
2. Cart overlay and sidebar HTML
3. Cart JavaScript script

## Pages Already Updated
- ✅ `index.html` - Cart added
- ✅ `checkout.html` - Cart added

## Pages That Need Updates
- [ ] `about.html`
- [ ] `shop.html`
- [ ] `contact.html`
- [ ] `commissions.html`
- [ ] `category-weaving.html`
- [ ] `category-copper.html`
- [ ] `category-wands.html`
- [ ] `category-cattoys.html`
- [ ] `category-knives.html`
- [ ] `category-jewellery.html`
- [ ] `Jewellery.html`
- [ ] `product-bodkins.html`
- [ ] `product-mallets.html`
- [ ] `category-puppets.html`
- [ ] `category-prints.html`
- [ ] `category-tools.html`

## Quick Copy-Paste Template

### 1. Cart Button (add before Instagram icon in header)
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

### 2. Cart Structure (add after </header>)
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

### 3. Cart Script (add before </body>)
```html
<script src="./assets/js/cart.js"></script>
```

## Automated Script

You can use a script to add the cart to all pages automatically. See the `add-cart-to-all-pages.js` script (if created).

## Verification

After adding cart to a page:
1. Open the page in a browser
2. Check that cart icon appears in header
3. Click cart icon - sidebar should open
4. Add an item to cart - it should appear
5. Check browser console for any errors

