/**
 * Comprehensive Form Validation Module
 * Provides real-time validation, custom error messages, visual indicators, and specialized validators
 */

(function() {
  'use strict';

  // Use Security module for sanitization if available
  const sanitizeInput = (input) => {
    if (window.Security && window.Security.sanitizeInput) {
      return window.Security.sanitizeInput(input);
    }
    return input;
  };

  // Validation rules and error messages
  const VALIDATION_RULES = {
    required: {
      validate: (value) => value.trim().length > 0,
      message: 'This field is required'
    },
    email: {
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Please enter a valid email address'
    },
    phone: {
      validate: (value) => {
        // Accepts various phone formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +1 123 456 7890, etc.
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}[-\s\.]?[0-9]{1,9}$/;
        const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15 && phoneRegex.test(value);
      },
      message: 'Please enter a valid phone number (e.g., (123) 456-7890)'
    },
    minLength: {
      validate: (value, min) => value.trim().length >= min,
      message: (min) => `Must be at least ${min} characters long`
    },
    maxLength: {
      validate: (value, max) => value.trim().length <= max,
      message: (max) => `Must be no more than ${max} characters long`
    },
    zipCode: {
      validate: (value) => {
        // Accepts US ZIP (12345 or 12345-6789) and Canadian postal codes (A1A 1A1)
        const usZipRegex = /^\d{5}(-\d{4})?$/;
        const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        return usZipRegex.test(value) || canadianPostalRegex.test(value);
      },
      message: 'Please enter a valid ZIP/Postal code'
    },
    address: {
      validate: (value) => {
        // Basic address validation - should have at least a number and street name
        const addressRegex = /^\d+\s+[A-Za-z0-9\s\-\.,#]+$/i;
        return value.trim().length >= 10 && addressRegex.test(value);
      },
      message: 'Please enter a valid address (e.g., 123 Main Street)'
    },
    city: {
      validate: (value) => {
        // City should be at least 2 characters and contain letters
        const cityRegex = /^[A-Za-z\s\-']{2,}$/;
        return cityRegex.test(value.trim());
      },
      message: 'Please enter a valid city name'
    },
    state: {
      validate: (value) => {
        // Accepts state names (2+ characters) or 2-letter state codes
        const stateRegex = /^[A-Za-z]{2,}$/;
        return stateRegex.test(value.trim());
      },
      message: 'Please enter a valid state or province'
    },
    country: {
      validate: (value) => {
        // Country should be at least 2 characters
        return value.trim().length >= 2;
      },
      message: 'Please enter a valid country name'
    }
  };

  /**
   * Form Validator Class
   */
  class FormValidator {
    constructor(formElement, options = {}) {
      this.form = formElement;
      this.options = {
        realTime: options.realTime !== false, // Default to true
        showErrorsOnSubmit: options.showErrorsOnSubmit !== false, // Default to true
        validateOnBlur: options.validateOnBlur !== false, // Default to true
        customRules: options.customRules || {},
        ...options
      };
      
      this.fields = new Map();
      this.isValid = false;
      
      this.init();
    }

    /**
     * Initialize the validator
     */
    init() {
      if (!this.form) {
        console.error('FormValidator: Form element not found');
        return;
      }

      // Find all form fields
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'hidden') {
          this.registerField(input);
        }
      });

      // Set up form submission handler
      this.form.addEventListener('submit', (e) => {
        if (!this.validateForm()) {
          e.preventDefault();
          e.stopPropagation();
          
          // Focus first invalid field
          const firstInvalid = this.form.querySelector('.field-error');
          if (firstInvalid) {
            const input = firstInvalid.querySelector('input, textarea, select') || firstInvalid.closest('.form-group')?.querySelector('input, textarea, select');
            if (input) {
              input.focus();
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          
          // Announce to screen readers
          if (window.A11y && window.A11y.announce) {
            const errorCount = this.form.querySelectorAll('.field-error').length;
            window.A11y.announce(`Form validation failed. Please correct ${errorCount} error${errorCount !== 1 ? 's' : ''}.`, 'assertive');
          }
        }
      });
    }

    /**
     * Register a field for validation
     */
    registerField(input) {
      const fieldConfig = this.getFieldConfig(input);
      this.fields.set(input, fieldConfig);

      // Set up real-time validation
      if (this.options.realTime) {
        input.addEventListener('input', () => {
          // Debounce validation for better UX
          clearTimeout(input._validationTimeout);
          input._validationTimeout = setTimeout(() => {
            this.validateField(input, false);
          }, 300);
        });
      }

      // Validate on blur
      if (this.options.validateOnBlur) {
        input.addEventListener('blur', () => {
          this.validateField(input, true);
        });
      }

      // Clear errors on focus
      input.addEventListener('focus', () => {
        this.clearFieldError(input);
      });
    }

    /**
     * Get validation configuration for a field
     */
    getFieldConfig(input) {
      const config = {
        rules: [],
        customMessage: null
      };

      // Check for required attribute
      if (input.hasAttribute('required')) {
        config.rules.push({ type: 'required' });
      }

      // Check input type
      if (input.type === 'email') {
        config.rules.push({ type: 'email' });
      }

      // Check for data-validation attribute (e.g., data-validation="phone,minLength:10")
      if (input.hasAttribute('data-validation')) {
        const validationAttr = input.getAttribute('data-validation');
        validationAttr.split(',').forEach(rule => {
          const [ruleType, ruleValue] = rule.split(':');
          config.rules.push({ type: ruleType.trim(), value: ruleValue ? ruleValue.trim() : null });
        });
      }

      // Check for data-error-message attribute
      if (input.hasAttribute('data-error-message')) {
        config.customMessage = input.getAttribute('data-error-message');
      }

      // Auto-detect field type based on name or id
      const nameOrId = (input.name || input.id || '').toLowerCase();
      if (nameOrId.includes('phone') || nameOrId.includes('tel')) {
        if (!config.rules.find(r => r.type === 'phone')) {
          config.rules.push({ type: 'phone' });
        }
      }
      if (nameOrId.includes('zip') || nameOrId.includes('postal')) {
        if (!config.rules.find(r => r.type === 'zipCode')) {
          config.rules.push({ type: 'zipCode' });
        }
      }
      if (nameOrId.includes('address') && input.tagName === 'TEXTAREA') {
        if (!config.rules.find(r => r.type === 'address')) {
          config.rules.push({ type: 'address' });
        }
      }
      if (nameOrId.includes('city')) {
        if (!config.rules.find(r => r.type === 'city')) {
          config.rules.push({ type: 'city' });
        }
      }
      if (nameOrId.includes('state') || nameOrId.includes('province')) {
        if (!config.rules.find(r => r.type === 'state')) {
          config.rules.push({ type: 'state' });
        }
      }
      if (nameOrId.includes('country')) {
        if (!config.rules.find(r => r.type === 'country')) {
          config.rules.push({ type: 'country' });
        }
      }

      return config;
    }

    /**
     * Validate a single field
     */
    validateField(input, showError = true) {
      const config = this.fields.get(input);
      if (!config) return true;

      // Sanitize input value before validation
      let value = input.value || '';
      value = sanitizeInput(value);
      
      let isValid = true;
      let errorMessage = null;

      // Check each rule
      for (const rule of config.rules) {
        const ruleDef = VALIDATION_RULES[rule.type] || this.options.customRules[rule.type];
        if (!ruleDef) continue;

        const ruleValue = rule.value;
        const ruleIsValid = ruleDef.validate(value, ruleValue);

        if (!ruleIsValid) {
          isValid = false;
          errorMessage = config.customMessage || 
                        (typeof ruleDef.message === 'function' ? ruleDef.message(ruleValue) : ruleDef.message);
          break; // Stop at first error
        }
      }

      // Update UI
      if (showError || !isValid) {
        if (isValid) {
          this.clearFieldError(input);
        } else {
          this.showFieldError(input, errorMessage);
        }
      }

      return isValid;
    }

    /**
     * Validate entire form
     */
    validateForm() {
      let isValid = true;

      this.fields.forEach((config, input) => {
        if (!this.validateField(input, this.options.showErrorsOnSubmit)) {
          isValid = false;
        }
      });

      this.isValid = isValid;
      return isValid;
    }

    /**
     * Show error for a field
     */
    showFieldError(input, message) {
      // Remove existing error
      this.clearFieldError(input);

      // Add error class to input
      input.classList.add('input-error');
      input.setAttribute('aria-invalid', 'true');

      // Find or create error container
      let errorContainer = input.closest('.form-group') || input.parentElement;
      if (!errorContainer.classList.contains('form-group')) {
        // Wrap input if not already in form-group
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        errorContainer = wrapper;
      }

      // Create error message element
      const errorElement = document.createElement('span');
      errorElement.className = 'field-error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'polite');
      errorElement.textContent = message;

      // Insert error message after input
      input.parentNode.insertBefore(errorElement, input.nextSibling);
      errorContainer.classList.add('field-error');

      // Add error icon if not present
      if (!input.parentNode.querySelector('.error-icon')) {
        const errorIcon = document.createElement('span');
        errorIcon.className = 'error-icon';
        errorIcon.setAttribute('aria-hidden', 'true');
        errorIcon.innerHTML = '⚠';
        input.parentNode.insertBefore(errorIcon, input);
      }
    }

    /**
     * Clear error for a field
     */
    clearFieldError(input) {
      input.classList.remove('input-error');
      input.removeAttribute('aria-invalid');

      const formGroup = input.closest('.form-group') || input.parentElement;
      formGroup.classList.remove('field-error');

      // Remove error message
      const errorMessage = formGroup.querySelector('.field-error-message');
      if (errorMessage) {
        errorMessage.remove();
      }

      // Remove error icon
      const errorIcon = formGroup.querySelector('.error-icon');
      if (errorIcon) {
        errorIcon.remove();
      }
    }

    /**
     * Reset form validation
     */
    reset() {
      this.fields.forEach((config, input) => {
        this.clearFieldError(input);
        input.value = '';
      });
      this.isValid = false;
    }
  }

  // Auto-initialize validators for forms with data-validate attribute
  function autoInit() {
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('form[data-validate]');
      forms.forEach(form => {
        if (!form._validator) {
          form._validator = new FormValidator(form);
        }
      });
    });
  }

  // Expose to global scope
  window.FormValidator = FormValidator;
  window.VALIDATION_RULES = VALIDATION_RULES;

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();

