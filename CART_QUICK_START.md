# Cart System Quick Start Guide

## 🎯 Quick Setup (5 minutes)

### 1. Test the Cart (No setup required)
1. Open any product page (e.g., `product-bodkins.html`)
2. Click "Add to Cart"
3. Click the cart icon in the header
4. Verify items appear in cart

### 2. Set Up Email Notifications (Optional but recommended)

#### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up (free account)
3. Verify your email

#### Step 2: Get Your Keys
1. **Public Key**: Account → General → Public Key
2. **Service ID**: Email Services → Add Service → Copy Service ID
3. **Template ID**: Email Templates → Create Template → Copy Template ID

#### Step 3: Update Files

**In `checkout.html` (line ~18):**
```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");
```

**In `assets/js/checkout.js` (line ~112):**
```javascript
to_email: 'your-email@example.com', // Your email
```

**In `assets/js/checkout.js` (lines ~130-131):**
```javascript
const serviceId = 'YOUR_SERVICE_ID_HERE';
const templateId = 'YOUR_TEMPLATE_ID_HERE';
```

#### Step 4: Create Email Template
In EmailJS dashboard, create a template with these variables:
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{customer_address}}`
- `{{customer_city}}`
- `{{customer_state}}`
- `{{customer_zip}}`
- `{{customer_country}}`
- `{{customer_notes}}`
- `{{order_items}}`
- `{{order_total}}`
- `{{order_date}}`

## ✅ That's It!

The cart is now fully functional. Test it by:
1. Adding items to cart
2. Going to checkout
3. Submitting an order
4. Checking your email

## 📋 What Works Now

- ✅ Add items to cart from any product page
- ✅ View cart in sidebar
- ✅ Update quantities
- ✅ Remove items
- ✅ Checkout with customer form
- ✅ Email notifications (after EmailJS setup)
- ✅ Cart persists across pages
- ✅ Mobile-friendly design

## 🆘 Need Help?

See `CART_SETUP_GUIDE.md` for detailed instructions.

