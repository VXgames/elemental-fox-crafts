# Google Analytics Setup Guide

## What You Need

You need a **Google Analytics 4 (GA4) Measurement ID** that looks like: `G-XXXXXXXXXX`

The format is always: `G-` followed by 10 alphanumeric characters (letters and numbers).

## Step-by-Step Setup

### 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"** or **"Create Account"**

### 2. Create a Property

1. **Account Name**: Enter "Elemental Fox Crafts" (or your preferred name)
2. **Property Name**: Enter "Elemental Fox Crafts Website" (or your preferred name)
   - This is what you'll see in your Analytics dashboard
   - You can use any name you like - it's just for organization
3. **Reporting Time Zone**: Select your time zone
4. **Currency**: Select your currency (e.g., USD)
5. Click **"Next"**

### 3. Business Information (Optional)

1. Fill in your business details (optional)
2. Click **"Create"**

### 4. Get Your Measurement ID

1. After creating the property, you'll see a **"Data Streams"** section
2. Click **"Add stream"** → **"Web"**
3. Enter your website details:
   - **Website URL**: `https://elementalfoxcrafts.com` (or your domain)
   - **Stream name**: "Elemental Fox Crafts Website" (or your preferred name)
4. Click **"Create stream"**
5. You'll see your **Measurement ID** - it looks like `G-XXXXXXXXXX`
   - **Copy this ID** - you'll need it for all your HTML files

### 5. Update Your Website

Replace `G-XXXXXXXXXX` with your actual Measurement ID in all HTML files.

**Example:**
```html
<!-- Before -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- After (with your actual ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ9"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ9');
</script>
```

## Where to Find Your Measurement ID Later

If you need to find your Measurement ID again:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click on your property (e.g., "Elemental Fox Crafts Website")
3. Go to **Admin** (gear icon in bottom left)
4. Under **Property**, click **"Data Streams"**
5. Click on your web stream
6. Your **Measurement ID** is displayed at the top (starts with `G-`)

## Quick Reference

- **Property Name**: Use any name you like (e.g., "Elemental Fox Crafts Website")
  - This is just for organization in your Analytics dashboard
  - It doesn't affect your website or tracking
  
- **Measurement ID Format**: `G-XXXXXXXXXX`
  - Always starts with `G-`
  - Followed by 10 alphanumeric characters
  - Example: `G-ABC123XYZ9`

- **Where to Use It**: Replace `G-XXXXXXXXXX` in all HTML files:
  - `index.html`
  - `shop.html`
  - `about.html`
  - `contact.html`
  - `commissions.html`
  - `cart.html`
  - `checkout.html`
  - `order-confirmation.html`
  - All category pages (`category-*.html`)
  - All product pages (`product-*.html`)
  - `Jewellery.html`

## Testing

After adding your Measurement ID:

1. Visit your website
2. Go to Google Analytics → **Reports** → **Realtime**
3. You should see your visit appear within a few seconds
4. If you see activity, it's working! ✅

## Important Notes

- **Free to Use**: Google Analytics is free
- **Privacy**: Make sure to add a privacy policy to your website if you're using Analytics
- **GDPR Compliance**: If you have EU visitors, you may need a cookie consent banner
- **Data Delay**: Some reports may take 24-48 hours to populate

## Need Help?

- [Google Analytics Help Center](https://support.google.com/analytics)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)

