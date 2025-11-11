# Cart and Checkout Pages Guide

## Overview
You now have a complete cart and checkout system with:
- **Cart Page** (`cart.html`) - Full page view to review items, update quantities, and calculate shipping
- **Checkout Page** (`checkout.html`) - Customer information and payment processing

## Cart Page Features

### Location
- **URL**: `/cart.html`
- **Access**: Click "Proceed to Checkout" from cart sidebar or cart page

### Features
- ✅ View all cart items with images
- ✅ Update item quantities
- ✅ Remove items
- ✅ Calculate shipping costs
- ✅ See order summary with subtotal, shipping, and total
- ✅ Proceed to checkout

### Shipping Calculation
The cart page includes shipping estimation:
- **Free shipping** for US orders over $150
- **Standard US shipping**: $12.00
- **Canada shipping**: $25.00
- **International shipping**: $35.00

You can customize these rates in `assets/js/cart-page.js` (function `calculateShipping()`).

## Checkout Page Features

### Location
- **URL**: `/checkout.html`
- **Access**: Click "Proceed to Checkout" from cart page

### Features
- ✅ Customer information form
- ✅ Order summary with items and totals
- ✅ Payment method selection:
  - Credit/Debit Card (Stripe)
  - PayPal
  - Other payment methods
- ✅ Secure payment processing
- ✅ Email order notifications

## Payment Processing Setup

### Stripe Setup (For Credit Card Payments)

1. **Create Stripe Account**
   - Go to https://stripe.com/
   - Sign up for an account
   - Complete business verification

2. **Get Your Publishable Key**
   - Go to Stripe Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_`)

3. **Update checkout.js**
   - Open `assets/js/checkout.js`
   - Find line ~174: `const stripeKey = 'YOUR_STRIPE_PUBLISHABLE_KEY';`
   - Replace with your actual publishable key

4. **Backend Setup Required**
   - Stripe requires a backend server to process payments securely
   - You'll need to create payment intents on your server
   - See Stripe documentation: https://stripe.com/docs/payments/accept-a-payment

### PayPal Setup (Optional)

1. **Create PayPal Business Account**
   - Go to https://www.paypal.com/business
   - Sign up for a business account

2. **Integrate PayPal SDK**
   - Add PayPal JavaScript SDK to `checkout.html`
   - Update `processPayment()` function in `checkout.js`
   - See PayPal documentation: https://developer.paypal.com/docs/

### Email Notifications Setup

See `CART_SETUP_GUIDE.md` for EmailJS setup instructions.

## User Flow

1. **Add Items to Cart**
   - Browse products
   - Click "Add to Cart"
   - Items appear in cart sidebar

2. **View Cart**
   - Click cart icon or "Proceed to Checkout"
   - Navigate to `/cart.html`
   - Review items, update quantities
   - Calculate shipping

3. **Checkout**
   - Click "Proceed to Checkout" from cart page
   - Fill out customer information
   - Select payment method
   - Complete order

4. **Order Confirmation**
   - Order email sent to you
   - Cart is cleared
   - Customer redirected to home page

## Customization

### Shipping Rates
Edit `assets/js/cart-page.js`, function `calculateShipping()`:
```javascript
// Customize these rates
if (country === 'US') {
  if (subtotal >= 150) {
    baseShipping = 0; // Free shipping threshold
  } else {
    baseShipping = 12.00; // Standard shipping
  }
} else if (country === 'CA') {
  baseShipping = 25.00;
} else {
  baseShipping = 35.00;
}
```

### Payment Methods
Add or remove payment methods in `checkout.html`:
- Add new radio button in `.payment-methods`
- Add corresponding `.payment-details` div
- Update `processPayment()` function in `checkout.js`

## Testing

### Test Cart Page
1. Add items to cart
2. Navigate to `/cart.html`
3. Update quantities
4. Calculate shipping
5. Verify totals update correctly

### Test Checkout
1. Go to cart page
2. Click "Proceed to Checkout"
3. Fill out form
4. Select payment method
5. Submit order
6. Check email for order notification

## Notes

- **Stripe requires backend**: Full Stripe integration needs a server-side component
- **PayPal requires setup**: PayPal integration needs additional configuration
- **Email notifications**: Requires EmailJS setup (see `CART_SETUP_GUIDE.md`)
- **Shipping calculation**: Currently uses simple rules - can be enhanced with shipping APIs
- **Payment processing**: Currently validates cards but doesn't charge (needs backend)

## Next Steps

1. Set up Stripe account and add publishable key
2. Create backend server for payment processing (or use Stripe Checkout)
3. Set up EmailJS for order notifications
4. Customize shipping rates
5. Test complete checkout flow

