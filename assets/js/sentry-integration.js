/**
 * Sentry Error Logging Integration
 * Provides external error logging to Sentry.io
 * 
 * To use:
 * 1. Sign up at https://sentry.io
 * 2. Create a new project and get your DSN
 * 3. Add the Sentry script to your HTML before this file:
 *    <script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js" integrity="..." crossorigin="anonymous"></script>
 * 4. Initialize Sentry in your HTML:
 *    <script>
 *      Sentry.init({ dsn: 'YOUR_DSN_HERE' });
 *    </script>
 * 5. This module will automatically integrate with the error handler
 */

(function() {
  'use strict';

  /**
   * Initialize Sentry integration
   * This is called automatically if Sentry is available
   */
  function initSentryIntegration() {
    if (typeof window.Sentry === 'undefined') {
      console.warn('Sentry is not loaded. External error logging will not be available.');
      console.info('To enable Sentry, add the Sentry script and initialize it in your HTML.');
      return false;
    }

    try {
      // Configure Sentry with additional context
      window.Sentry.configureScope((scope) => {
        // Add user context if available
        if (window.cart && window.cart.getCart) {
          try {
            const cart = window.cart.getCart();
            if (cart && cart.length > 0) {
              scope.setTag('has_cart_items', 'true');
              scope.setTag('cart_item_count', cart.length.toString());
            }
          } catch (e) {
            // Ignore cart errors
          }
        }

        // Add page context
        scope.setTag('page', window.location.pathname);
        scope.setContext('browser', {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine
        });
      });

      // Set up global error handler
      window.addEventListener('error', (event) => {
        if (window.Sentry && window.Sentry.captureException) {
          window.Sentry.captureException(event.error || new Error(event.message), {
            tags: {
              errorType: 'unhandled_error',
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            },
            extra: {
              message: event.message,
              url: window.location.href
            }
          });
        }
      });

      // Set up unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        if (window.Sentry && window.Sentry.captureException) {
          window.Sentry.captureException(event.reason, {
            tags: {
              errorType: 'unhandled_promise_rejection'
            },
            extra: {
              url: window.location.href
            }
          });
        }
      });

      console.log('Sentry integration initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Sentry integration:', error);
      return false;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSentryIntegration);
  } else {
    // DOM already loaded, initialize immediately
    initSentryIntegration();
  }

  // Also try to initialize after a short delay in case Sentry loads asynchronously
  setTimeout(() => {
    if (typeof window.Sentry !== 'undefined' && !window._sentryInitialized) {
      initSentryIntegration();
      window._sentryInitialized = true;
    }
  }, 1000);

  // Expose initialization function globally
  window.initSentryIntegration = initSentryIntegration;

})();

