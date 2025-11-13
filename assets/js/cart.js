/**
 * Shopping Cart System
 * Handles cart functionality, localStorage, and UI updates
 */

(function() {
  'use strict';

  // Cart state
  let cart = [];
  const CART_STORAGE_KEY = 'elemental_fox_cart';
  let isUpdatingCart = false; // Flag to prevent infinite loops

  // Initialize cart from localStorage
  function initCart() {
    try {
      // Use safe storage if available, otherwise fallback to direct localStorage
      if (window.safeStorage) {
        cart = window.safeStorage.get(CART_STORAGE_KEY, []);
      } else {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          cart = window.safeJsonParse ? window.safeJsonParse(storedCart, []) : JSON.parse(storedCart);
        } else {
          cart = [];
        }
      }
      
      // Validate cart data structure
      if (!Array.isArray(cart)) {
        console.warn('Cart data is not an array, resetting cart');
        cart = [];
      }
      
      // Only update UI if DOM is ready
      if (document.readyState !== 'loading') {
        updateCartUI();
        updateCartBadge();
      }
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'cart_init', {
          showToUser: false,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM
        });
      } else {
        console.error('Error loading cart from localStorage:', error);
      }
      cart = [];
    }
  }

  // Save cart to localStorage
  function saveCart() {
    if (isUpdatingCart) {
      console.warn('Cart update already in progress, skipping duplicate call...');
      return;
    }
    
    try {
      isUpdatingCart = true;
      
      // Use safe storage if available
      if (window.safeStorage) {
        const saved = window.safeStorage.set(CART_STORAGE_KEY, cart);
        if (!saved) {
          // Storage failed, but continue with UI update
          console.warn('Failed to save cart to storage, but continuing with UI update');
        }
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
      
      updateCartUI();
      updateCartBadge();
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'cart_save', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH
        });
      } else {
        console.error('Error saving cart to localStorage:', error);
        if (window.showError) {
          window.showError('Unable to save cart. Your changes may be lost.');
        }
      }
    } finally {
      // Use setTimeout to ensure flag is reset after UI updates complete
      setTimeout(() => {
        isUpdatingCart = false;
      }, 100);
    }
  }

  // Parse price string to number (e.g., "$24.00" -> 24.00)
  function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  // Format price number to string (e.g., 24.00 -> "$24.00")
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  // Generate unique cart item ID
  function generateCartItemId(product) {
    // Use product id if available, otherwise use name + image as unique identifier
    return product.id ? `product-${product.id}` : `product-${product.name}-${product.image}`;
  }

  // Add item to cart (internal function)
  function addItemToCart(product) {
    try {
      console.log('addItemToCart called with:', product);
      
      // Validate product data using error handler if available
      if (window.ErrorHandler) {
        if (!product) {
          window.ErrorHandler.handle(new Error('Product is null or undefined'), 'cart_add_item', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
            customMessage: 'Invalid product data. Please try again.'
          });
          return;
        }

        if (!window.ErrorHandler.validateRequired(product, ['name', 'price'], 'cart_add_item')) {
          return;
        }

        if (!window.ErrorHandler.validatePrice(product.price)) {
          window.ErrorHandler.handle(new Error('Invalid price format'), 'cart_add_item', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
            customMessage: 'Invalid product price. Please try again.'
          });
          return;
        }
      } else {
        // Fallback validation if error handler is not available
        if (!product) {
          console.error('Product is null or undefined');
          if (window.showError) {
            window.showError('Invalid product data. Please try again.');
          } else {
            alert('Error: Invalid product data. Please try again.');
          }
          return;
        }

        if (!product.name) {
          console.error('Product name is missing:', product);
          if (window.showError) {
            window.showError('Product name is missing. Please try again.');
          } else {
            alert('Error: Product name is missing. Please try again.');
          }
          return;
        }

        if (!product.price) {
          console.error('Product price is missing:', product);
          if (window.showError) {
            window.showError('Product price is missing. Please try again.');
          } else {
            alert('Error: Product price is missing. Please try again.');
          }
          return;
        }
      }

      const cartItemId = generateCartItemId(product);
      const price = parsePrice(product.price);
      
      console.log('Parsed price:', price, 'from:', product.price);
      
      if (isNaN(price) || price <= 0) {
        const error = new Error(`Invalid price: ${product.price} parsed as: ${price}`);
        if (window.ErrorHandler) {
          window.ErrorHandler.handle(error, 'cart_add_item', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
            customMessage: 'Invalid product price. Please try again.'
          });
        } else {
          console.error('Invalid price:', product.price, 'parsed as:', price);
          if (window.showError) {
            window.showError('Invalid product price. Please try again.');
          } else {
            alert('Error: Invalid product price. Please try again.');
          }
        }
        return;
      }
      
      // Check if item already exists in cart
      const existingItem = cart.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        // Increment quantity
        existingItem.quantity += 1;
        // Update message if provided (only if different from existing)
        if (product.message && product.message.trim()) {
          if (existingItem.message) {
            // Append new message if different
            if (existingItem.message !== product.message.trim()) {
              existingItem.message += '\n\n' + product.message.trim();
            }
          } else {
            existingItem.message = product.message.trim();
          }
        }
      } else {
        // Add new item
        cart.push({
          cartItemId: cartItemId,
          id: product.id || null,
          name: product.name,
          price: price,
          priceString: product.price,
          image: product.image || '',
          alt: product.alt || product.name,
          quantity: 1,
          message: product.message ? product.message.trim() : '' // Store custom message
        });
      }
      
      saveCart();
      console.log('Item successfully added to cart. Cart now has', cart.length, 'items');
      showCartNotification('Item added to cart!');
      
      // Register background sync if offline
      if (!navigator.onLine && window.PWA && window.PWA.registerBackgroundSync) {
        window.PWA.registerBackgroundSync('sync-cart', cart);
      }
      
      // Announce to screen readers (find item again after saveCart in case cart was updated)
      const addedItem = cart.find(item => item.cartItemId === cartItemId);
      if (window.A11y && window.A11y.announceCartUpdate) {
        window.A11y.announceCartUpdate('add', product.name, addedItem ? addedItem.quantity : 1);
      }
      
      // Open cart on mobile after adding
      if (window.innerWidth <= 768) {
        setTimeout(function() {
          openCart();
        }, 300);
      }
    } catch (error) {
      // Use error handler if available
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'cart_add_item', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH,
          customMessage: 'Unable to add item to cart. Please try again.'
        });
      } else {
        console.error('Error adding item to cart:', error);
        console.error('Error stack:', error.stack);
        const errorMsg = error.message || 'Unable to add item to cart. Please try again.';
        if (window.showError) {
          window.showError(errorMsg);
        } else {
          alert('Error: ' + errorMsg);
        }
      }
    }
  }

  // Custom confirmation modal
  function showConfirmModal(message, title = 'Confirm') {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'confirm-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'confirm-modal-title');
      overlay.setAttribute('aria-describedby', 'confirm-modal-message');

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'confirm-modal';

      // Create header
      const header = document.createElement('div');
      header.className = 'confirm-modal-header';
      const titleEl = document.createElement('h3');
      titleEl.id = 'confirm-modal-title';
      titleEl.className = 'confirm-modal-title';
      titleEl.textContent = title;
      header.appendChild(titleEl);

      // Create body
      const body = document.createElement('div');
      body.className = 'confirm-modal-body';
      body.id = 'confirm-modal-message';
      body.textContent = message;

      // Create footer
      const footer = document.createElement('div');
      footer.className = 'confirm-modal-footer';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'confirm-modal-btn confirm-modal-btn-cancel';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.type = 'button';
      cancelBtn.setAttribute('aria-label', 'Cancel');
      
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'confirm-modal-btn confirm-modal-btn-confirm';
      confirmBtn.textContent = 'Confirm';
      confirmBtn.type = 'button';
      confirmBtn.setAttribute('aria-label', 'Confirm');
      confirmBtn.setAttribute('autofocus', '');

      // Assemble modal
      modal.appendChild(header);
      modal.appendChild(body);
      footer.appendChild(cancelBtn);
      footer.appendChild(confirmBtn);
      modal.appendChild(footer);
      overlay.appendChild(modal);

      // Add to DOM
      document.body.appendChild(overlay);

      // Focus trap
      const focusableElements = modal.querySelectorAll('button');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal(false);
        }
      };

      const closeModal = (confirmed) => {
        overlay.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.removeEventListener('keydown', handleTabKey);
          document.removeEventListener('keydown', handleEscape);
          resolve(confirmed);
        }, 300);
      };

      // Event listeners
      cancelBtn.addEventListener('click', () => closeModal(false));
      confirmBtn.addEventListener('click', () => closeModal(true));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(false);
        }
      });

      document.addEventListener('keydown', handleTabKey);
      document.addEventListener('keydown', handleEscape);

      // Show modal with animation
      requestAnimationFrame(() => {
        overlay.classList.add('active');
        confirmBtn.focus();
      });
    });
  }

  // Remove item from cart
  function removeFromCart(cartItemId) {
    try {
      if (!cartItemId) {
        console.warn('removeFromCart called without cartItemId');
        return;
      }
      
      const itemCount = cart.length;
      cart = cart.filter(item => item.cartItemId !== cartItemId);
      
      if (cart.length === itemCount) {
        console.warn('Item not found in cart:', cartItemId);
        return;
      }
      
      const removedItem = cart.find(item => item.cartItemId === cartItemId);
      saveCart();
      showCartNotification('Item removed from cart');
      
      // Announce to screen readers
      if (window.A11y && window.A11y.announceCartUpdate && removedItem) {
        window.A11y.announceCartUpdate('remove', removedItem.name, 0);
      }
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'cart_remove_item', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM
        });
      } else {
        console.error('Error removing item from cart:', error);
      }
    }
  }

  // Update item quantity
  function updateQuantity(cartItemId, newQuantity) {
    try {
      if (!cartItemId) {
        console.warn('updateQuantity called without cartItemId');
        return;
      }
      
      if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }
      
      // Validate quantity
      const quantity = Math.max(1, Math.floor(newQuantity));
      if (isNaN(quantity) || quantity < 1) {
        console.warn('Invalid quantity:', newQuantity);
        return;
      }
      
      const item = cart.find(item => item.cartItemId === cartItemId);
      if (item) {
        item.quantity = quantity;
        saveCart();
        
        // Announce to screen readers
        if (window.A11y && window.A11y.announceCartUpdate) {
          window.A11y.announceCartUpdate('update', item.name, quantity);
        }
      } else {
        console.warn('Item not found in cart:', cartItemId);
      }
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'cart_update_quantity', {
          showToUser: false,
          severity: window.ErrorHandler.ERROR_SEVERITY.LOW
        });
      } else {
        console.error('Error updating quantity:', error);
      }
    }
  }

  // Get cart total
  function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Update cart badge
  function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    const count = getCartItemCount();
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Show cart notification
  function showCartNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.cart-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Escape HTML helper function (use Security module if available)
  function escapeHtml(text) {
    if (window.Security && window.Security.escapeHtml) {
      return window.Security.escapeHtml(text);
    }
    // Fallback
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Update cart UI
  function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotal = document.querySelector('.cart-total-amount');
    const checkoutBtn = document.querySelector('.cart-checkout-btn');

    if (!cartItemsContainer) {
      // Cart container doesn't exist on this page (e.g., product detail pages)
      // This is expected behavior, so we silently return
      return;
    }

    if (cart.length === 0) {
      // Show empty cart message
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartFooter) cartFooter.style.display = 'none';
      cartItemsContainer.innerHTML = '';
      return;
    }

    // Hide empty cart message
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'flex';

    // Clear and populate cart items
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.setAttribute('role', 'list');
    cartItemsContainer.setAttribute('aria-label', `Shopping cart with ${cart.length} item${cart.length !== 1 ? 's' : ''}`);
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      // Escape HTML to prevent XSS
      const itemName = escapeHtml(item.name);
      const itemAlt = escapeHtml(item.alt || item.name);
      const itemImage = escapeHtml(item.image || '');
      const itemCartId = escapeHtml(item.cartItemId);
      cartItem.setAttribute('role', 'listitem');
      cartItem.setAttribute('aria-label', `Cart item: ${itemName}, quantity ${item.quantity}, price ${formatPrice(item.price)}`);
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${itemImage}" alt="${itemAlt}" onerror="this.onerror=null; this.style.display='none';">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${itemName}</h4>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          ${item.message ? `<p class="cart-item-message"><em>Note: ${escapeHtml(item.message)}</em></p>` : ''}
          <div class="cart-item-quantity">
            <button class="quantity-btn" data-action="decrease" data-id="${itemCartId}" aria-label="Decrease quantity for ${itemName}">−</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${itemCartId}" aria-label="Quantity for ${itemName}">
            <button class="quantity-btn" data-action="increase" data-id="${itemCartId}" aria-label="Increase quantity for ${itemName}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${itemCartId}" aria-label="Remove ${itemName} from cart">×</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    // Update total
    if (cartTotal) {
      cartTotal.textContent = formatPrice(getCartTotal());
    }

    // Enable/disable checkout button
    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
    }
  }

  // Set up event delegation for cart items (called once during initialization)
  function setupCartEventDelegation() {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) {
      console.warn('Cart content not found. Event delegation will not work.');
      return;
    }

    // Use event delegation for all cart item interactions
    cartContent.addEventListener('click', function(e) {
      const target = e.target;
      
      // Quantity buttons
      if (target.classList.contains('quantity-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const cartItemId = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;
        
        const input = cartItem.querySelector('.quantity-input');
        if (!input) return;
        
        if (action === 'increase') {
          const newQuantity = parseInt(input.value) + 1;
          updateQuantity(cartItemId, newQuantity);
        } else if (action === 'decrease') {
          const newQuantity = Math.max(1, parseInt(input.value) - 1);
          updateQuantity(cartItemId, newQuantity);
        }
      }
      
      // Remove buttons
      if (target.classList.contains('cart-item-remove')) {
        e.preventDefault();
        e.stopPropagation();
        const cartItemId = target.getAttribute('data-id');
        if (cartItemId) {
          showConfirmModal('Remove this item from cart?', 'Remove Item').then((confirmed) => {
            if (confirmed) {
              removeFromCart(cartItemId);
            }
          });
        }
      }
    });

    // Quantity input changes
    cartContent.addEventListener('change', function(e) {
      if (e.target.classList.contains('quantity-input')) {
        const cartItemId = e.target.getAttribute('data-id');
        const newQuantity = parseInt(e.target.value) || 1;
        if (cartItemId) {
          updateQuantity(cartItemId, newQuantity);
        }
      }
    });
  }

  // Open cart
  function openCart() {
    try {
      const cartSidebar = document.querySelector('.cart-sidebar');
      const cartOverlay = document.querySelector('.cart-overlay');
      
      if (!cartSidebar) {
        console.error('Cart sidebar not found. Cannot open cart.');
        return;
      }
      
      if (!cartOverlay) {
        console.error('Cart overlay not found. Cannot open cart.');
        return;
      }
      
      cartSidebar.classList.add('open');
      cartSidebar.setAttribute('aria-hidden', 'false');
      cartSidebar.setAttribute('aria-modal', 'true');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Announce to screen readers
      const itemCount = getCartItemCount();
      if (window.A11y && window.A11y.announce) {
        window.A11y.announce(`Shopping cart opened. ${itemCount} item${itemCount !== 1 ? 's' : ''} in cart.`);
      }
      
      // Reload cart from localStorage to ensure we have the latest data
      // This is important when items are added from product pages
      initCart();
      
      // Focus first focusable element in cart
      const firstFocusable = cartSidebar.querySelector('button, a, input');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
      
      // Update cart UI when opening (in case items were added from another tab)
      updateCartUI();
      updateCartBadge();
    } catch (error) {
      console.error('Error opening cart:', error);
    }
  }

  // Close cart
  function closeCart() {
    try {
      console.log('closeCart() called');
      const cartSidebar = document.querySelector('.cart-sidebar');
      const cartOverlay = document.querySelector('.cart-overlay');
      
      console.log('Cart sidebar found:', cartSidebar);
      console.log('Cart overlay found:', cartOverlay);
      
      if (cartSidebar) {
        cartSidebar.classList.remove('open');
        cartSidebar.setAttribute('aria-hidden', 'true');
        cartSidebar.removeAttribute('aria-modal');
        console.log('Removed "open" class from sidebar');
      }
      if (cartOverlay) {
        cartOverlay.classList.remove('active');
        console.log('Removed "active" class from overlay');
      }
      document.body.style.overflow = '';
      
      // Announce to screen readers
      if (window.A11y && window.A11y.announce) {
        window.A11y.announce('Shopping cart closed');
      }
      
      console.log('Cart closed successfully');
    } catch (error) {
      console.error('Error closing cart:', error);
    }
  }

  // Get cart data for checkout
  function getCartData() {
    return {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: getCartTotal(),
      itemCount: getCartItemCount()
    };
  }

  // Clear cart
  function clearCart() {
    cart = [];
    saveCart();
  }

  // Flag to prevent duplicate event listener setup
  let cartUIInitialized = false;
  let cartEventHandlersSetup = false;

  // Set up document-level event handlers (only once)
  function setupCartEventHandlers() {
    if (cartEventHandlersSetup) {
      console.log('Cart event handlers already set up, skipping...');
      return;
    }

    console.log('Setting up cart event handlers...');

    // Cart toggle button - use event delegation
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('.cart-toggle');
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        openCart();
      }
    });

    // Close cart buttons - use closest to handle clicks on button or its children (like the × symbol)
    document.addEventListener('click', function(e) {
      const closeBtn = e.target.closest('.cart-close');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Cart close button clicked (delegation)');
        closeCart();
      }
    }, true); // Use capture phase to catch event earlier

    // Also add direct listener as backup
    setTimeout(function() {
      const closeButtons = document.querySelectorAll('.cart-close');
      closeButtons.forEach(btn => {
        if (!btn.hasAttribute('data-close-listener-attached')) {
          btn.setAttribute('data-close-listener-attached', 'true');
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Cart close button clicked (direct listener)');
            closeCart();
          });
        }
      });
      if (closeButtons.length > 0) {
        console.log('Direct close button listeners attached');
      }
    }, 500);

    // Checkout button - use event delegation with better debugging
    document.addEventListener('click', function(e) {
      // Check if click is on the button or inside it
      const checkoutBtn = e.target.closest('.cart-checkout-btn');
      if (checkoutBtn) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Cart sidebar checkout button clicked!');
        console.log('Current cart:', cart);
        console.log('Cart length:', cart.length);
        
        if (!cart || cart.length === 0) {
          if (window.showInfo) {
            window.showInfo('Your cart is empty');
          } else {
            alert('Your cart is empty');
          }
          return;
        }
        
        // Navigate to cart page first (not directly to checkout)
        console.log('Navigating to cart.html...');
        try {
          window.location.href = 'cart.html';
        } catch (error) {
          console.error('Error navigating to cart:', error);
          alert('Error navigating to cart page. Please try again.');
        }
      }
    }, true); // Use capture phase to catch event earlier

    // Also add direct listener as backup (after a short delay to ensure button exists)
    setTimeout(function() {
      const sidebarCheckoutBtn = document.getElementById('sidebar-checkout-btn');
      if (sidebarCheckoutBtn && !sidebarCheckoutBtn.hasAttribute('data-listener-attached')) {
        sidebarCheckoutBtn.setAttribute('data-listener-attached', 'true');
        sidebarCheckoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Cart sidebar checkout button clicked (direct listener)!');
          console.log('Current cart:', cart);
          console.log('Cart length:', cart.length);
          
          if (!cart || cart.length === 0) {
            alert('Your cart is empty');
            return;
          }
          
          console.log('Navigating to cart.html...');
          window.location.href = 'cart.html';
        });
        console.log('Direct checkout button listener attached');
      }
    }, 500);

    cartEventHandlersSetup = true;
    console.log('Cart event handlers set up successfully');
  }

  // Initialize cart UI when DOM is ready
  function initCartUI() {
    if (cartUIInitialized) {
      console.warn('Cart UI already initialized');
      return;
    }

    // Set up event handlers first (only once)
    setupCartEventHandlers();

    // Wait a bit to ensure DOM is fully ready
    setTimeout(function() {
      // Overlay click to close (only set up once per page load)
      const cartOverlay = document.querySelector('.cart-overlay');
      if (cartOverlay && !cartOverlay.hasAttribute('data-listener-attached')) {
        cartOverlay.setAttribute('data-listener-attached', 'true');
        cartOverlay.addEventListener('click', function(e) {
          if (e.target === cartOverlay) {
            closeCart();
          }
        });
      } else if (!cartOverlay) {
        console.warn('Cart overlay not found');
      }

      // Prevent cart sidebar click from closing (only set up once per page load)
      const cartSidebar = document.querySelector('.cart-sidebar');
      if (cartSidebar && !cartSidebar.hasAttribute('data-listener-attached')) {
        cartSidebar.setAttribute('data-listener-attached', 'true');
        cartSidebar.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      } else if (!cartSidebar) {
        console.warn('Cart sidebar not found');
      }

      // Set up event delegation for cart items (one-time setup)
      setupCartEventDelegation();
      
      // Initial UI update
      updateCartUI();
      updateCartBadge();
      
      cartUIInitialized = true;
    }, 100);
  }

  // Make addToCart available globally immediately (before DOM ready)
  // This allows other scripts to call it even if DOM isn't ready
  window.addToCart = function(product) {
    console.log('window.addToCart called with:', product);
    
    // Ensure cart is initialized
    if (!cart || cart.length === undefined) {
      console.log('Initializing cart...');
      initCart();
    }
    
    // Validate that product is an object
        if (!product || typeof product !== 'object') {
          console.error('Invalid product data - not an object:', product);
          if (window.showError) {
            window.showError('Invalid product data. Please try again.');
          } else {
            alert('Error: Invalid product data. Please try again.');
          }
          return;
        }
    
    addItemToCart(product);
  };

  // Make cart functions available globally
  // Expose confirmation modal for use in other modules
  window.showConfirmModal = showConfirmModal;

  window.cartAPI = {
    getCart: () => cart,
    getCartData: getCartData,
    clearCart: clearCart,
    getCartTotal: getCartTotal,
    getCartItemCount: getCartItemCount,
    openCart: openCart,
    closeCart: closeCart,
    saveCart: saveCart
  };

  // Initialize when DOM is ready
  function initializeCart() {
    initCart();
    initCartUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCart);
  } else {
    // DOM is already ready, but wait a bit to ensure all scripts are loaded
    setTimeout(initializeCart, 50);
  }
})();

