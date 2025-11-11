# Security Testing Guide

This guide explains how to test the security features implemented in the Elemental Fox Crafts website.

## Quick Start

1. **Open the test page**: Navigate to `security-test.html` in your browser
2. **Run tests**: Click the test buttons for each security feature
3. **Review results**: Check the test results and output log

## Test Coverage

### Test 1: XSS Protection

Tests that malicious input is properly sanitized and cannot execute scripts.

#### 1.1 Script Tag Injection
- **Input**: `<script>alert("XSS")</script>`
- **Expected**: Script tags are removed or escaped
- **How to test**: Enter the input and click "Test Script Tag"
- **Pass criteria**: No alert appears, script tags are sanitized

#### 1.2 Event Handler Injection
- **Input**: `<img src="x" onerror="alert('XSS')">`
- **Expected**: Event handlers (onerror, onclick, etc.) are removed
- **How to test**: Enter the input and click "Test Event Handler"
- **Pass criteria**: Event handlers are stripped from the input

#### 1.3 JavaScript Protocol
- **Input**: `javascript:alert("XSS")`
- **Expected**: javascript: protocol is blocked
- **How to test**: Enter the input and click "Test JavaScript Protocol"
- **Pass criteria**: javascript: protocol is removed from URLs

#### 1.4 HTML Entity Escaping
- **Input**: `<div>Test & "quotes" &amp; entities</div>`
- **Expected**: HTML entities are properly escaped
- **How to test**: Enter the input and click "Test HTML Escaping"
- **Pass criteria**: Special characters are escaped (e.g., `<` becomes `&lt;`)

### Test 2: Rate Limiting

Tests that forms cannot be submitted too rapidly.

#### 2.1 Rapid Form Submissions
- **Expected**: After 5 submissions within 1 minute, further submissions are blocked
- **How to test**: 
  1. Fill in the test form
  2. Click "Submit Form" rapidly (6+ times)
  3. Observe the rate limit message after 5 attempts
- **Pass criteria**: Rate limiting message appears after 5 attempts

### Test 3: Content Security Policy (CSP)

Tests that CSP headers don't break legitimate third-party services.

#### 3.1 Google Analytics
- **Expected**: Google Analytics loads correctly
- **How to test**: Click "Test Google Analytics"
- **Pass criteria**: gtag or dataLayer is available
- **Note**: May show "not loaded" if not on a page with GA - this is normal

#### 3.2 Stripe.js
- **Expected**: Stripe.js loads correctly
- **How to test**: Click "Test Stripe.js"
- **Pass criteria**: Stripe object is available
- **Note**: May show "not loaded" if not on checkout page - this is normal

#### 3.3 EmailJS
- **Expected**: EmailJS loads correctly
- **How to test**: Click "Test EmailJS"
- **Pass criteria**: emailjs object is available
- **Note**: May show "not loaded" if not on checkout page - this is normal

### Test 4: Input Sanitization

Tests that legitimate input is not over-sanitized.

#### 4.1 Legitimate Input
- **Input**: "John Doe - email@example.com - (123) 456-7890"
- **Expected**: Legitimate content is preserved
- **How to test**: Enter the input and click "Test Legitimate Input"
- **Pass criteria**: Name, email, and phone number are all preserved

## Manual Testing on Real Forms

### Checkout Form (`checkout.html`)

1. **Open** `checkout.html` in your browser
2. **Test XSS protection**:
   - Enter `<script>alert("XSS")</script>` in the name field
   - Submit the form
   - Verify: No alert appears, script is sanitized
3. **Test rate limiting**:
   - Submit the form 6 times rapidly
   - Verify: Rate limit message appears after 5 attempts
4. **Test legitimate input**:
   - Enter normal customer information
   - Verify: All data is preserved correctly

### Contact Form (`contact.html`)

1. **Open** `contact.html` in your browser
2. **Test XSS protection**:
   - Enter malicious input in the message field
   - Submit the form
   - Verify: Input is sanitized
3. **Test rate limiting**:
   - Submit the form rapidly
   - Verify: Rate limiting works

### Commissions Form (`commissions.html`)

1. **Open** `commissions.html` in your browser
2. **Test XSS protection**:
   - Enter malicious input in the message field
   - Submit the form
   - Verify: Input is sanitized
3. **Test rate limiting**:
   - Submit the form rapidly
   - Verify: Rate limiting works

## Browser Testing

Test on the following browsers to ensure compatibility:

### Chrome
1. Open `security-test.html`
2. Run all tests
3. Verify all tests pass
4. Check browser console for any CSP violations

### Firefox
1. Open `security-test.html`
2. Run all tests
3. Verify all tests pass
4. Check browser console for any CSP violations

### Safari
1. Open `security-test.html`
2. Run all tests
3. Verify all tests pass
4. Check browser console for any CSP violations

### Edge
1. Open `security-test.html`
2. Run all tests
3. Verify all tests pass
4. Check browser console for any CSP violations

## Checking CSP Violations

To check for CSP violations:

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Look for CSP violation messages** (usually in red)
4. **Common violations**:
   - `Refused to execute inline script` - May indicate CSP is working
   - `Refused to load script from '...'` - May indicate missing CSP whitelist entry

## Expected Test Results

All tests should show:
- ✅ **PASS** for XSS protection tests
- ✅ **PASS** for rate limiting tests
- ✅ **PASS** for CSP tests (on pages with those services)
- ✅ **PASS** for legitimate input preservation

## Troubleshooting

### Security Module Not Loaded
- **Issue**: Tests show "Security module not loaded"
- **Solution**: Ensure `assets/js/security.js` is loaded before running tests
- **Check**: Open browser console and verify `window.Security` exists

### Rate Limiting Not Working
- **Issue**: Form can be submitted more than 5 times
- **Solution**: 
  1. Check that `security.js` is loaded
  2. Verify form has `data-validate` attribute
  3. Check browser console for errors
  4. Ensure localStorage is enabled

### CSP Blocking Legitimate Resources
- **Issue**: Google Analytics, Stripe, or EmailJS don't load
- **Solution**: 
  1. Check CSP meta tag in HTML
  2. Verify required domains are whitelisted:
     - Google Analytics: `https://www.googletagmanager.com`, `https://www.google-analytics.com`
     - Stripe: `https://js.stripe.com`
     - EmailJS: `https://cdn.jsdelivr.net`
  3. Check browser console for CSP violation messages

## Additional Security Tests

### Manual XSS Payload Testing

Try these additional XSS payloads manually:

```html
<!-- Basic script -->
<script>alert('XSS')</script>

<!-- Event handler -->
<img src=x onerror=alert('XSS')>

<!-- JavaScript protocol -->
<a href="javascript:alert('XSS')">Click</a>

<!-- SVG with script -->
<svg><script>alert('XSS')</script></svg>

<!-- Iframe -->
<iframe src="javascript:alert('XSS')"></iframe>

<!-- Data URL -->
<img src="data:text/html,<script>alert('XSS')</script>">

<!-- CSS expression (IE) -->
<div style="background:url('javascript:alert(\"XSS\")')">

<!-- HTML5 event -->
<video><source onerror="alert('XSS')">
```

All of these should be sanitized and not execute.

### Rate Limiting Edge Cases

Test these scenarios:

1. **Multiple forms**: Submit different forms rapidly - each should have its own rate limit
2. **Time window**: Wait 1 minute after 5 submissions - should be able to submit again
3. **localStorage disabled**: Rate limiting should gracefully degrade

## Reporting Issues

If you find security issues:

1. **Document the issue**: 
   - What test failed
   - What input was used
   - What the expected vs actual behavior was
   - Browser and version

2. **Check the code**:
   - Review `assets/js/security.js`
   - Check form validation in `assets/js/form-validator.js`
   - Verify CSP headers in HTML files

3. **Fix and retest**:
   - Apply the fix
   - Re-run all tests
   - Verify the issue is resolved

## Continuous Testing

For ongoing security:

1. **Run tests regularly**: After any security-related changes
2. **Monitor CSP violations**: Check browser console regularly
3. **Review user input**: Monitor form submissions for suspicious patterns
4. **Update dependencies**: Keep security libraries updated
5. **Stay informed**: Follow security best practices and updates

