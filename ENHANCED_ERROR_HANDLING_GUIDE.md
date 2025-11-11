# Enhanced Error Handling Guide

This document describes the enhanced error handling system implemented for Elemental Fox Crafts, including user-friendly messages, recovery suggestions, retry mechanisms, and external error logging.

## Features

### 1. User-Friendly Error Messages

All errors are automatically converted to user-friendly messages that:
- Avoid technical jargon
- Provide clear, actionable information
- Are context-aware (different messages for different error types)

**Example:**
```javascript
// Instead of: "TypeError: Failed to fetch"
// User sees: "Network connection error. Please check your internet connection and try again."
```

### 2. Error Recovery Suggestions

Each error type includes specific recovery suggestions displayed to users:

- **Network Errors**: Check connection, refresh page, check firewall
- **Storage Errors**: Clear cache, remove cart items, check browser settings
- **Parse Errors**: Refresh page, clear cache, contact support
- **Not Found Errors**: Check URL, navigate home, use search
- **Validation Errors**: Check required fields, verify input format
- **Permission Errors**: Check browser settings, allow permissions
- **Unknown Errors**: Refresh page, clear cache, contact support

### 3. Retry Mechanisms

#### Automatic Retry with Exponential Backoff

The `safeFetch` function automatically retries failed network requests:

```javascript
// Automatically retries up to 2 times with exponential backoff
const response = await window.safeFetch('/api/data', {
  timeout: 10000,
  retries: 2,
  context: 'loading_product_data'
});
```

#### Manual Retry Function

The `retryWithBackoff` function allows you to retry any async operation:

```javascript
const result = await window.retryWithBackoff(
  async () => {
    // Your async operation here
    return await someAsyncOperation();
  },
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    onRetry: (attempt, maxAttempts, delay) => {
      console.log(`Retrying... (${attempt}/${maxAttempts})`);
    },
    shouldRetry: (error, attempt) => {
      // Only retry on network errors
      return error.message.includes('network');
    }
  }
);
```

#### User-Triggered Retry

Errors can include a retry button that users can click:

```javascript
window.ErrorHandler.handle(error, 'fetch_product', {
  retry: async () => {
    return await loadProduct(productId);
  },
  showRecovery: true
});
```

### 4. External Error Logging (Sentry)

#### Setup Instructions

1. **Sign up for Sentry**:
   - Go to https://sentry.io
   - Create a free account
   - Create a new project (select JavaScript/Browser)

2. **Get your DSN**:
   - Copy your DSN from the Sentry project settings

3. **Add Sentry to your HTML**:
   ```html
   <!-- Add before other scripts -->
   <script 
     src="https://browser.sentry-cdn.com/7.91.0/bundle.min.js"
     integrity="sha384-..."
     crossorigin="anonymous">
   </script>
   
   <!-- Initialize Sentry -->
   <script>
     Sentry.init({
       dsn: 'YOUR_DSN_HERE',
       environment: 'production', // or 'development'
       tracesSampleRate: 1.0, // Adjust based on traffic
       beforeSend(event, hint) {
         // Filter out sensitive data
         if (event.request) {
           delete event.request.cookies;
         }
         return event;
       }
     });
   </script>
   
   <!-- Load Sentry integration -->
   <script src="./assets/js/sentry-integration.js" defer></script>
   ```

4. **Automatic Integration**:
   - The error handler automatically sends errors to Sentry
   - Unhandled errors and promise rejections are captured
   - Additional context (URL, user agent, cart state) is included

## Usage Examples

### Basic Error Handling

```javascript
try {
  // Your code here
  const data = await fetchData();
} catch (error) {
  window.ErrorHandler.handle(error, 'fetch_data', {
    showToUser: true,
    severity: 'medium'
  });
}
```

### Error with Retry

```javascript
try {
  const response = await window.safeFetch('/api/products', {
    retries: 3,
    context: 'loading_products',
    onRetry: (attempt, maxAttempts, delay) => {
      console.log(`Retrying in ${delay}ms...`);
    }
  });
  const products = await response.json();
} catch (errorInfo) {
  // Error already handled and displayed to user
  // errorInfo.retry contains a retry function if available
  if (errorInfo.canRetry) {
    // User can click retry button in the error toast
  }
}
```

### Custom Error Message with Recovery

```javascript
try {
  await saveToCart(item);
} catch (error) {
  window.ErrorHandler.handle(error, 'save_cart', {
    customMessage: 'Unable to add item to cart',
    showRecovery: true,
    retry: async () => {
      return await saveToCart(item);
    }
  });
}
```

### Auto-Retry on Error

```javascript
window.ErrorHandler.handle(error, 'load_data', {
  autoRetry: true,
  retryDelay: 2000,
  retry: async () => {
    return await loadData();
  }
});
```

## Error Types

The system recognizes these error types:

- `NETWORK_ERROR`: Network/fetch failures
- `STORAGE_ERROR`: localStorage/sessionStorage issues
- `PARSE_ERROR`: JSON parsing errors
- `NOT_FOUND_ERROR`: 404 errors
- `VALIDATION_ERROR`: Input validation failures
- `PERMISSION_ERROR`: Browser permission denials
- `UNKNOWN_ERROR`: All other errors

## Error Severity Levels

- `LOW`: Minor issues, non-critical
- `MEDIUM`: Moderate issues, may affect functionality
- `HIGH`: Serious issues, significant impact
- `CRITICAL`: Critical issues, breaks core functionality

## Integration with Existing Code

The enhanced error handling is automatically integrated with:

- `cart.js`: Cart operations
- `checkout.js`: Checkout process
- `category-loader.js`: Category loading
- `subcategory-loader.js`: Subcategory loading
- `product-detail-loader.js`: Product detail loading
- `search-results.js`: Search functionality
- `featured-items.js`: Featured items loading

All these modules use `window.safeFetch` and `window.ErrorHandler.handle` for consistent error handling.

## Testing

To test error handling:

1. **Network Errors**: Disconnect internet and try loading a page
2. **Storage Errors**: Fill localStorage to capacity
3. **Parse Errors**: Corrupt a JSON file
4. **Not Found Errors**: Request a non-existent resource
5. **Validation Errors**: Submit invalid form data

## Best Practices

1. **Always provide context**: Include a meaningful context string
2. **Use appropriate severity**: Don't mark minor issues as critical
3. **Enable recovery suggestions**: Let users know how to fix issues
4. **Provide retry options**: For transient errors, include retry functions
5. **Don't show technical errors**: Let the system convert them to user-friendly messages
6. **Log to Sentry in production**: Enable Sentry for production deployments

## Configuration

### Disable Error Logging

```javascript
window.ErrorHandler.handle(error, 'context', {
  silent: true // Don't log to console or Sentry
});
```

### Disable User Notifications

```javascript
window.ErrorHandler.handle(error, 'context', {
  showToUser: false // Don't show toast notification
});
```

### Custom Error Message

```javascript
window.ErrorHandler.handle(error, 'context', {
  customMessage: 'Your custom message here'
});
```

## Troubleshooting

### Sentry Not Logging Errors

1. Check that Sentry script is loaded before `sentry-integration.js`
2. Verify DSN is correct
3. Check browser console for Sentry initialization errors
4. Ensure Sentry is initialized before errors occur

### Retry Not Working

1. Ensure retry function is async if operation is async
2. Check that retry function returns a Promise
3. Verify error is retryable (not a validation error, etc.)

### Recovery Suggestions Not Showing

1. Ensure `showRecovery: true` is set in options
2. Check that `showErrorWithRecovery` function is available
3. Verify toast-messages.js is loaded

## Support

For issues or questions about error handling:
1. Check browser console for detailed error logs
2. Review Sentry dashboard for error reports
3. Check this guide for usage examples

