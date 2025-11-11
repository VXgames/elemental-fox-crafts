/**
 * Accessibility Enhancement Module
 * Provides screen reader announcements, focus management, and keyboard navigation
 */

(function() {
  'use strict';

  // Create live region for screen reader announcements
  let liveRegion = null;

  /**
   * Initialize accessibility features
   */
  function init() {
    createLiveRegion();
    setupSkipLinks();
    setupKeyboardShortcuts();
    setupFocusManagement();
    enhanceFormLabels();
  }

  /**
   * Create a live region for screen reader announcements
   */
  function createLiveRegion() {
    liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;';
      document.body.appendChild(liveRegion);
    }
  }

  /**
   * Announce a message to screen readers
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' (default) or 'assertive'
   */
  function announce(message, priority = 'polite') {
    if (!liveRegion) {
      createLiveRegion();
    }
    
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = '';
    
    // Use setTimeout to ensure the announcement is triggered
    setTimeout(() => {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }, 100);
  }

  /**
   * Setup skip navigation links
   */
  function setupSkipLinks() {
    // Skip link is added in HTML, just ensure it works
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Remove tabindex after focus
          setTimeout(() => {
            target.removeAttribute('tabindex');
          }, 1000);
        }
      });
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    // ESC key to close modals/cart
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        // Close cart if open
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
          const closeBtn = cartSidebar.querySelector('.cart-close');
          if (closeBtn) {
            closeBtn.click();
            announce('Shopping cart closed');
          }
        }
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.nav-links.open');
        if (mobileMenu) {
          const menuToggle = document.querySelector('.mobile-menu-toggle');
          if (menuToggle) {
            menuToggle.click();
            announce('Navigation menu closed');
          }
        }
      }
      
      // Alt+S to focus search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.getElementById('header-search');
        if (searchInput) {
          searchInput.focus();
          announce('Search field focused');
        }
      }
      
      // Alt+C to open cart
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const cartToggle = document.querySelector('.cart-toggle');
        if (cartToggle) {
          cartToggle.click();
          announce('Shopping cart opened');
        }
      }
    });
  }

  /**
   * Setup focus management
   */
  function setupFocusManagement() {
    // Trap focus in cart sidebar when open
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (cartSidebar.classList.contains('open')) {
              trapFocus(cartSidebar);
            }
          }
        });
      });
      
      observer.observe(cartSidebar, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    
    // Restore focus when cart closes
    let previousFocus = null;
    const cartToggle = document.querySelector('.cart-toggle');
    const cartClose = document.querySelector('.cart-close');
    
    if (cartToggle && cartClose) {
      cartToggle.addEventListener('click', function() {
        previousFocus = document.activeElement;
      });
      
      cartClose.addEventListener('click', function() {
        if (previousFocus && previousFocus !== cartToggle) {
          setTimeout(() => {
            previousFocus.focus();
          }, 100);
        }
      });
    }
  }

  /**
   * Trap focus within an element
   */
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
      firstElement.focus();
    }
    
    element.addEventListener('keydown', function trapHandler(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        element.removeEventListener('keydown', trapHandler);
      }
    });
  }

  /**
   * Enhance form labels with better associations
   */
  function enhanceFormLabels() {
    // Ensure all inputs have associated labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const id = input.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        
        if (!label && !input.closest('label')) {
          // Create a label if missing
          const placeholder = input.getAttribute('placeholder');
          if (placeholder) {
            input.setAttribute('aria-label', placeholder);
          }
        }
      }
    });
  }

  /**
   * Announce cart updates
   */
  function announceCartUpdate(action, itemName, quantity) {
    let message = '';
    switch(action) {
      case 'add':
        message = `${itemName} added to cart. Quantity: ${quantity}`;
        break;
      case 'remove':
        message = `${itemName} removed from cart`;
        break;
      case 'update':
        message = `${itemName} quantity updated to ${quantity}`;
        break;
      case 'clear':
        message = 'Cart cleared';
        break;
      default:
        message = 'Cart updated';
    }
    announce(message);
  }

  /**
   * Announce search results
   */
  function announceSearchResults(count, query) {
    if (count === 0) {
      announce(`No results found for "${query}"`);
    } else {
      announce(`Found ${count} result${count === 1 ? '' : 's'} for "${query}"`);
    }
  }

  /**
   * Announce page changes
   */
  function announcePageChange(pageTitle) {
    announce(`Navigated to ${pageTitle}`);
  }

  /**
   * Get accessible name for an element
   */
  function getAccessibleName(element) {
    if (!element) return '';
    
    // Check aria-label first
    if (element.getAttribute('aria-label')) {
      return element.getAttribute('aria-label');
    }
    
    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }
    
    // Check associated label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) {
        return label.textContent.trim();
      }
    }
    
    // Check text content
    if (element.textContent) {
      return element.textContent.trim();
    }
    
    // Check alt text for images
    if (element.tagName === 'IMG' && element.alt) {
      return element.alt;
    }
    
    return '';
  }

  // Expose functions to global scope
  window.A11y = {
    announce: announce,
    announceCartUpdate: announceCartUpdate,
    announceSearchResults: announceSearchResults,
    announcePageChange: announcePageChange,
    getAccessibleName: getAccessibleName,
    trapFocus: trapFocus
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

