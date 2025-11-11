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
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        cart = JSON.parse(storedCart);
        // Only update UI if DOM is ready
        if (document.readyState !== 'loading') {
          updateCartUI();
          updateCartBadge();
        }
      } else {
        cart = [];
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
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
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      updateCartUI();
      updateCartBadge();
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
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
      
      // Validate product data
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

      const cartItemId = generateCartItemId(product);
      const price = parsePrice(product.price);
      
      console.log('Parsed price:', price, 'from:', product.price);
      
          if (isNaN(price) || price <= 0) {
            console.error('Invalid price:', product.price, 'parsed as:', price);
            if (window.showError) {
              window.showError('Invalid product price. Please try again.');
            } else {
              alert('Error: Invalid product price. Please try again.');
            }
            return;
          }
      
      // Check if item already exists in cart
      const existingItem = cart.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        // Increment quantity
        existingItem.quantity += 1;
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
          quantity: 1
        });
      }
      
      saveCart();
      console.log('Item successfully added to cart. Cart now has', cart.length, 'items');
      showCartNotification('Item added to cart!');
      
      // Show success message
      if (window.showSuccess) {
        window.showSuccess(`${product.name} added to cart!`);
      }
      
      // Open cart on mobile after adding
      if (window.innerWidth <= 768) {
        setTimeout(function() {
          openCart();
        }, 300);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      console.error('Error stack:', error.stack);
      
      // Show user-friendly error message
      const errorMsg = error.message || 'Unable to add item to cart. Please try again.';
      if (window.showError) {
        window.showError(errorMsg);
      } else {
        alert('Error: ' + errorMsg);
      }
    }
  }

  // Remove item from cart
  function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart();
    showCartNotification('Item removed from cart');
  }

  // Update item quantity
  function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
      item.quantity = Math.max(1, Math.floor(newQuantity));
      saveCart();
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

  // Update cart UI
  function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotal = document.querySelector('.cart-total-amount');
    const checkoutBtn = document.querySelector('.cart-checkout-btn');

    if (!cartItemsContainer) {
      console.warn('Cart items container not found. Cart UI will not update.');
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
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      // Escape HTML to prevent XSS
      const itemName = item.name.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const itemAlt = (item.alt || item.name).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${itemAlt}" onerror="this.onerror=null; this.style.display='none';">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${itemName}</h4>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn" data-action="decrease" data-id="${item.cartItemId}" aria-label="Decrease quantity">−</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.cartItemId}" aria-label="Quantity">
            <button class="quantity-btn" data-action="increase" data-id="${item.cartItemId}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.cartItemId}" aria-label="Remove item">×</button>
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
        if (cartItemId && confirm('Remove this item from cart?')) {
          removeFromCart(cartItemId);
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
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
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
        console.log('Removed "open" class from sidebar');
      }
      if (cartOverlay) {
        cartOverlay.classList.remove('active');
        console.log('Removed "active" class from overlay');
      }
      document.body.style.overflow = '';
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

