# Security Implementation Guide

This document outlines the security measures implemented in the Elemental Fox Crafts website and provides guidance for server-side security configuration.

## Client-Side Security Features

### 1. Input Sanitization
- **Location**: `assets/js/security.js`
- **Features**:
  - HTML entity escaping
  - Script tag removal
  - Event handler removal (onclick, onerror, etc.)
  - JavaScript protocol blocking
  - Data URL sanitization
  - Iframe/object/embed tag removal

### 2. Rate Limiting
- **Location**: `assets/js/security.js`
- **Features**:
  - Client-side rate limiting using localStorage
  - Configurable attempts and time windows
  - Prevents rapid form submissions
  - Default: 5 attempts per minute per form

### 3. XSS Protection
- All user input is sanitized before display
- HTML entities are escaped in all dynamic content
- Dangerous HTML tags and attributes are removed

## Server-Side Security Headers

For production deployment, configure your web server to include the following security headers:

### Content Security Policy (CSP)

Add the following CSP header to your server configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.emailjs.com https://api.stripe.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
```

**Explanation**:
- `default-src 'self'`: Only allow resources from same origin
- `script-src`: Allow scripts from self, Google Analytics, Stripe, and CDNs
- `style-src`: Allow styles from self and Google Fonts
- `font-src`: Allow fonts from self and Google Fonts
- `img-src`: Allow images from self, data URLs, and HTTPS
- `connect-src`: Allow AJAX/fetch to specified APIs
- `frame-src`: Allow Stripe iframes
- `object-src 'none'`: Block all object/embed tags
- `form-action 'self'`: Only allow form submissions to same origin
- `upgrade-insecure-requests`: Upgrade HTTP to HTTPS

### XSS Protection Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Explanation**:
- `X-Content-Type-Options: nosniff`: Prevents MIME type sniffing
- `X-Frame-Options: DENY`: Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block`: Enables browser XSS filter
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

### HTTPS and HSTS

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Explanation**:
- Forces HTTPS connections
- Applies to all subdomains
- Valid for 1 year

## Server Configuration Examples

### Apache (.htaccess)

```apache
<IfModule mod_headers.c>
    # Content Security Policy
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.emailjs.com https://api.stripe.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
    
    # XSS Protection
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # HSTS (only if using HTTPS)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>
```

### Nginx

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.emailjs.com https://api.stripe.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### Node.js/Express

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://js.stripe.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://api.emailjs.com", "https://api.stripe.com"],
      frameSrc: ["https://js.stripe.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Testing Security Headers

Use these tools to verify your security headers:
- [SecurityHeaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- Browser DevTools: Network tab → Response Headers

## Additional Security Recommendations

1. **HTTPS**: Always use HTTPS in production
2. **Regular Updates**: Keep all dependencies and server software updated
3. **Input Validation**: Validate all server-side inputs
4. **SQL Injection**: Use parameterized queries if using a database
5. **CSRF Protection**: Implement CSRF tokens for state-changing operations
6. **Session Security**: Use secure, HTTP-only cookies for sessions
7. **Error Handling**: Don't expose sensitive information in error messages
8. **File Uploads**: Validate file types and sizes on the server
9. **Dependencies**: Regularly audit npm packages for vulnerabilities
10. **Backups**: Maintain regular backups of your website and data

## Rate Limiting Notes

The client-side rate limiting in `security.js` provides basic protection but should be supplemented with server-side rate limiting for production. Consider implementing:
- IP-based rate limiting
- Per-user rate limiting
- Distributed rate limiting for load-balanced servers
- Tools like Redis for rate limiting in distributed systems

## CSP Meta Tag (Fallback)

If you cannot configure server headers, you can add a CSP meta tag to each HTML file's `<head>`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.emailjs.com https://api.stripe.com; frame-src https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';">
```

**Note**: Meta tags are less secure than HTTP headers and should only be used as a fallback.

