/**
 * Centralized Error Handling System
 * Provides consistent error handling, logging, and user feedback across the application
 */

(function() {
  'use strict';

  // Error types
  const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    STORAGE: 'STORAGE_ERROR',
    PARSE: 'PARSE_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    PERMISSION: 'PERMISSION_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
  };

  // Error severity levels
  const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };

  /**
   * Determine error type from error object
   */
  function getErrorType(error) {
    if (!error) return ERROR_TYPES.UNKNOWN;
    
    const message = error.message || error.toString();
    const name = error.name || '';
    
    // Network errors
    if (name === 'TypeError' && message.includes('fetch')) return ERROR_TYPES.NETWORK;
    if (message.includes('network') || message.includes('Network')) return ERROR_TYPES.NETWORK;
    if (message.includes('Failed to fetch')) return ERROR_TYPES.NETWORK;
    if (message.includes('CORS')) return ERROR_TYPES.NETWORK;
    
    // Storage errors
    if (name === 'QuotaExceededError') return ERROR_TYPES.STORAGE;
    if (message.includes('localStorage') || message.includes('sessionStorage')) return ERROR_TYPES.STORAGE;
    
    // Parse errors
    if (name === 'SyntaxError') return ERROR_TYPES.PARSE;
    if (message.includes('JSON') && message.includes('parse')) return ERROR_TYPES.PARSE;
    
    // Not found errors
    if (message.includes('404') || message.includes('not found')) return ERROR_TYPES.NOT_FOUND;
    
    // Validation errors
    if (message.includes('invalid') || message.includes('validation')) return ERROR_TYPES.VALIDATION;
    
    // Permission errors
    if (name === 'SecurityError' || message.includes('permission')) return ERROR_TYPES.PERMISSION;
    
    return ERROR_TYPES.UNKNOWN;
  }

  /**
   * Determine error severity
   */
  function getErrorSeverity(error, errorType) {
    // Critical errors that break core functionality
    if (errorType === ERROR_TYPES.STORAGE && error.name === 'QuotaExceededError') {
      return ERROR_SEVERITY.CRITICAL;
    }
    
    // High severity errors
    if (errorType === ERROR_TYPES.NETWORK && error.message.includes('CORS')) {
      return ERROR_SEVERITY.HIGH;
    }
    
    // Medium severity errors
    if (errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.NOT_FOUND) {
      return ERROR_SEVERITY.MEDIUM;
    }
    
    // Low severity errors
    return ERROR_SEVERITY.LOW;
  }

  /**
   * Get user-friendly error message
   */
  function getUserFriendlyMessage(error, errorType, context = '') {
    const errorMessages = {
      [ERROR_TYPES.NETWORK]: {
        default: 'Network connection error. Please check your internet connection and try again.',
        fetch: 'Unable to load data. Please check your connection and refresh the page.',
        timeout: 'Request timed out. Please try again.',
        cors: 'Unable to load resources. If you\'re opening this file directly, please use a local web server.'
      },
      [ERROR_TYPES.STORAGE]: {
        default: 'Unable to save data. Your browser\'s storage may be full.',
        quota: 'Storage is full. Please clear some space and try again.',
        permission: 'Unable to access storage. Please check your browser settings.'
      },
      [ERROR_TYPES.PARSE]: {
        default: 'Invalid data format. Please refresh the page.',
        json: 'Invalid data format. Please contact support if this persists.'
      },
      [ERROR_TYPES.NOT_FOUND]: {
        default: 'The requested resource was not found.',
        file: 'File not found. Please check the file path.',
        product: 'Product not found. It may have been removed or moved.'
      },
      [ERROR_TYPES.VALIDATION]: {
        default: 'Invalid input. Please check your data and try again.',
        form: 'Please fill in all required fields correctly.',
        price: 'Invalid price format. Please check the product data.'
      },
      [ERROR_TYPES.PERMISSION]: {
        default: 'Permission denied. Please check your browser settings.',
        storage: 'Storage access denied. Please enable storage in your browser settings.'
      },
      [ERROR_TYPES.UNKNOWN]: {
        default: 'An unexpected error occurred. Please try again or refresh the page.'
      }
    };

    // Get context-specific message if available
    const typeMessages = errorMessages[errorType] || errorMessages[ERROR_TYPES.UNKNOWN];
    let message = typeMessages[context] || typeMessages.default || typeMessages.default;

    // Add specific error details for debugging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const errorDetail = error.message || error.toString();
      if (errorDetail && errorDetail !== message) {
        console.error('Error details:', errorDetail);
      }
    }

    return message;
  }

  /**
   * Log error with context
   */
  function logError(error, context = '', severity = ERROR_SEVERITY.MEDIUM) {
    const errorType = getErrorType(error);
    const errorInfo = {
      type: errorType,
      severity: severity,
      message: error.message || error.toString(),
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log to console with appropriate level
    if (severity === ERROR_SEVERITY.CRITICAL || severity === ERROR_SEVERITY.HIGH) {
      console.error('Error:', errorInfo);
    } else {
      console.warn('Error:', errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    // Example: sendToErrorTrackingService(errorInfo);

    return errorInfo;
  }

  /**
   * Handle error with user feedback
   */
  function handleError(error, context = '', options = {}) {
    const {
      showToUser = true,
      severity = null,
      customMessage = null,
      silent = false,
      retry = null
    } = options;

    const errorType = getErrorType(error);
    const errorSeverity = severity || getErrorSeverity(error, errorType);
    const userMessage = customMessage || getUserFriendlyMessage(error, errorType, context);

    // Log error
    if (!silent) {
      logError(error, context, errorSeverity);
    }

    // Show user-friendly message
    if (showToUser && window.showError) {
      window.showError(userMessage);
    } else if (showToUser && !window.showError) {
      // Fallback to alert if toast system is not available
      console.warn('Toast system not available, using alert fallback');
      alert('Error: ' + userMessage);
    }

    // Return error info for further handling
    return {
      type: errorType,
      severity: errorSeverity,
      message: userMessage,
      originalError: error,
      retry: retry
    };
  }

  /**
   * Safe JSON parse with error handling
   */
  function safeJsonParse(jsonString, fallback = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      handleError(error, 'json_parse', {
        showToUser: false,
        severity: ERROR_SEVERITY.MEDIUM
      });
      return fallback;
    }
  }

  /**
   * Safe fetch with error handling and retry
   */
  async function safeFetch(url, options = {}, retries = 2) {
    const {
      timeout = 10000,
      showError = true,
      context = 'fetch'
    } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle specific HTTP status codes
          if (response.status === 404) {
            throw new Error(`Resource not found: ${url}`);
          } else if (response.status >= 500) {
            throw new Error(`Server error: ${response.status}`);
          } else if (response.status === 403 || response.status === 401) {
            throw new Error(`Permission denied: ${response.status}`);
          } else {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
          }
        }

        return response;
      } catch (error) {
        // Check if it's the last attempt
        if (attempt === retries) {
          const errorInfo = handleError(error, context, {
            showToUser: showError,
            severity: ERROR_SEVERITY.MEDIUM
          });
          throw errorInfo;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Fetch failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Safe localStorage operations
   */
  const safeStorage = {
    get: function(key, fallback = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? safeJsonParse(item, fallback) : fallback;
      } catch (error) {
        handleError(error, 'localStorage_get', {
          showToUser: false,
          severity: ERROR_SEVERITY.LOW
        });
        return fallback;
      }
    },

    set: function(key, value) {
      try {
        const jsonString = JSON.stringify(value);
        localStorage.setItem(key, jsonString);
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          handleError(error, 'localStorage_set', {
            showToUser: true,
            severity: ERROR_SEVERITY.CRITICAL,
            customMessage: 'Storage is full. Please clear some space or remove items from your cart.'
          });
        } else {
          handleError(error, 'localStorage_set', {
            showToUser: false,
            severity: ERROR_SEVERITY.MEDIUM
          });
        }
        return false;
      }
    },

    remove: function(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        handleError(error, 'localStorage_remove', {
          showToUser: false,
          severity: ERROR_SEVERITY.LOW
        });
        return false;
      }
    },

    clear: function() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        handleError(error, 'localStorage_clear', {
          showToUser: false,
          severity: ERROR_SEVERITY.LOW
        });
        return false;
      }
    }
  };

  /**
   * Validate required fields
   */
  function validateRequired(data, requiredFields, context = 'validation') {
    const missing = [];
    
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      const error = new Error(`Missing required fields: ${missing.join(', ')}`);
      handleError(error, context, {
        showToUser: true,
        severity: ERROR_SEVERITY.MEDIUM,
        customMessage: `Please fill in all required fields: ${missing.join(', ')}`
      });
      return false;
    }

    return true;
  }

  /**
   * Validate email format
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate price format
   */
  function validatePrice(price) {
    if (typeof price === 'number') {
      return price >= 0 && isFinite(price);
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      return !isNaN(numPrice) && numPrice >= 0 && isFinite(numPrice);
    }
    return false;
  }

  // Expose to global scope
  window.ErrorHandler = {
    handle: handleError,
    log: logError,
    safeJsonParse: safeJsonParse,
    safeFetch: safeFetch,
    safeStorage: safeStorage,
    validateRequired: validateRequired,
    validateEmail: validateEmail,
    validatePrice: validatePrice,
    ERROR_TYPES: ERROR_TYPES,
    ERROR_SEVERITY: ERROR_SEVERITY
  };

  // Also expose commonly used functions directly
  window.safeJsonParse = safeJsonParse;
  window.safeFetch = safeFetch;
  window.safeStorage = safeStorage;

})();

