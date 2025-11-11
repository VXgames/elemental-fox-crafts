/**
 * Security Module
 * Provides input sanitization, XSS protection, and rate limiting
 */

(function() {
  'use strict';

  /**
   * Enhanced HTML sanitization
   * Removes potentially dangerous HTML while preserving safe content
   */
  function sanitizeHtml(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    // Create a temporary div element
    const temp = document.createElement('div');
    temp.textContent = html; // This automatically escapes HTML
    
    // Get the escaped content
    return temp.innerHTML;
  }

  /**
   * Escape HTML entities to prevent XSS
   * Enhanced version that handles all dangerous characters
   */
  function escapeHtml(text) {
    if (text == null) {
      return '';
    }
    
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  /**
   * Sanitize user input for safe display
   * Removes script tags, event handlers, and other dangerous content
   */
  function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove script tags and their content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    
    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    // Remove data: URLs that could contain scripts
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    
    // Remove iframe tags
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // Remove object and embed tags
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    
    // Escape remaining HTML
    return escapeHtml(sanitized);
  }

  /**
   * Sanitize URL to prevent javascript: and data: URLs
   */
  function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') {
      return '';
    }

    const trimmed = url.trim();
    
    // Block javascript: protocol
    if (trimmed.toLowerCase().startsWith('javascript:')) {
      return '';
    }
    
    // Block data: URLs (except for images in specific contexts)
    if (trimmed.toLowerCase().startsWith('data:text/html')) {
      return '';
    }
    
    // Block vbscript: protocol
    if (trimmed.toLowerCase().startsWith('vbscript:')) {
      return '';
    }
    
    return trimmed;
  }

  /**
   * Rate limiting for form submissions
   * Prevents rapid form submissions using localStorage
   */
  class RateLimiter {
    constructor(formId, options = {}) {
      this.formId = formId;
      this.maxAttempts = options.maxAttempts || 5;
      this.windowMs = options.windowMs || 60000; // 1 minute default
      this.storageKey = `rate_limit_${formId}`;
    }

    /**
     * Check if form submission is allowed
     * @returns {object} { allowed: boolean, remaining: number, resetAt: number }
     */
    check() {
      const now = Date.now();
      const stored = this._getStoredData();
      
      // If no stored data or window expired, reset
      if (!stored || now > stored.resetAt) {
        const newData = {
          attempts: 0,
          resetAt: now + this.windowMs
        };
        this._setStoredData(newData);
        return {
          allowed: true,
          remaining: this.maxAttempts,
          resetAt: newData.resetAt
        };
      }

      // Check if limit exceeded
      if (stored.attempts >= this.maxAttempts) {
        const remainingMs = stored.resetAt - now;
        return {
          allowed: false,
          remaining: 0,
          resetAt: stored.resetAt,
          retryAfter: Math.ceil(remainingMs / 1000) // seconds
        };
      }

      // Increment attempts
      stored.attempts++;
      this._setStoredData(stored);

      return {
        allowed: true,
        remaining: this.maxAttempts - stored.attempts,
        resetAt: stored.resetAt
      };
    }

    /**
     * Reset rate limit (useful after successful submission)
     */
    reset() {
      if (window.safeStorage) {
        window.safeStorage.remove(this.storageKey);
      } else {
        try {
          localStorage.removeItem(this.storageKey);
        } catch (e) {
          console.warn('Failed to reset rate limit:', e);
        }
      }
    }

    _getStoredData() {
      try {
        if (window.safeStorage) {
          return window.safeStorage.get(this.storageKey, null);
        } else {
          const stored = localStorage.getItem(this.storageKey);
          return stored ? JSON.parse(stored) : null;
        }
      } catch (e) {
        return null;
      }
    }

    _setStoredData(data) {
      try {
        if (window.safeStorage) {
          window.safeStorage.set(this.storageKey, data);
        } else {
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
      } catch (e) {
        console.warn('Failed to store rate limit data:', e);
      }
    }
  }

  /**
   * Apply rate limiting to a form
   */
  function applyRateLimit(form, options = {}) {
    const formId = form.id || form.name || `form_${Date.now()}`;
    const limiter = new RateLimiter(formId, options);

    form.addEventListener('submit', function(e) {
      const check = limiter.check();
      
      if (!check.allowed) {
        e.preventDefault();
        e.stopPropagation();
        
        const minutes = Math.ceil(check.retryAfter / 60);
        const message = `Too many submission attempts. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.`;
        
        if (window.showError) {
          window.showError(message);
        } else {
          alert(message);
        }
        
        // Announce to screen readers
        if (window.A11y && window.A11y.announce) {
          window.A11y.announce(message, 'assertive');
        }
        
        return false;
      }

      // Reset on successful submission (called after form is processed)
      // Note: This should be called manually after successful submission
      form._rateLimiter = limiter;
    });

    return limiter;
  }

  /**
   * Sanitize all form inputs before submission
   */
  function sanitizeForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (input.type === 'submit' || input.type === 'button' || input.type === 'hidden') {
        return; // Skip these
      }

      if (input.type === 'email' || input.type === 'url') {
        // Sanitize URLs and emails
        input.value = sanitizeUrl(input.value);
      } else if (input.type === 'text' || input.tagName === 'TEXTAREA') {
        // Sanitize text inputs
        input.value = sanitizeInput(input.value);
      }
    });
  }

  /**
   * Initialize security for all forms
   */
  function initFormSecurity() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // Skip if rate limiting already applied (e.g., by FormValidator)
      if (!form._rateLimiter) {
        // Apply rate limiting
        applyRateLimit(form, {
          maxAttempts: 5,
          windowMs: 60000 // 1 minute
        });
      }

      // Sanitize inputs on submit (always apply, even if rate limiting was already set)
      // Use capture phase to ensure sanitization happens before other handlers
      form.addEventListener('submit', function(e) {
        sanitizeForm(form);
      }, true); // Use capture phase
    });
  }

  // Expose to global scope
  window.Security = {
    sanitizeHtml: sanitizeHtml,
    escapeHtml: escapeHtml,
    sanitizeInput: sanitizeInput,
    sanitizeUrl: sanitizeUrl,
    RateLimiter: RateLimiter,
    applyRateLimit: applyRateLimit,
    sanitizeForm: sanitizeForm
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormSecurity);
  } else {
    initFormSecurity();
  }

})();

