/**
 * Cart Page Handler
 * Handles the full cart page view with shipping estimates
 */

(function() {
  'use strict';

  let shippingCost = 0;

  // Format price
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  // Load cart data
  function loadCartData() {
    try {
      // Wait for cart API to be available
      if (window.cartAPI && window.cartAPI.getCartData) {
        return window.cartAPI.getCartData();
      }
      
      // Fallback: load directly from localStorage if cart API not ready
      const storedCart = localStorage.getItem('elemental_fox_cart');
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            alt: item.alt || item.name,
            cartItemId: item.cartItemId || `${item.id || item.name}_${item.price}`
          })),
          total: total,
          itemCount: cart.reduce((count, item) => count + item.quantity, 0)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading cart data:', error);
      return null;
    }
  }

  // Display cart items
  function displayCartItems(cartData) {
    const cartPageItems = document.getElementById('cart-page-items');
    const cartPageEmpty = document.getElementById('cart-page-empty');
    const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      if (cartPageEmpty) {
        cartPageEmpty.style.display = 'block';
      }
      if (cartPageItems) {
        cartPageItems.innerHTML = '';
        cartPageItems.style.display = 'none';
      }
      // Hide checkout button and summary when cart is empty
      if (checkoutBtn) {
        checkoutBtn.style.display = 'none';
      }
      if (cartSummary) {
        cartSummary.style.display = 'none';
      }
      updateTotals(0, 0);
      return;
    }

    if (cartPageEmpty) {
      cartPageEmpty.style.display = 'none';
    }
    if (cartPageItems) {
      cartPageItems.style.display = 'block';
      cartPageItems.innerHTML = '';
    }
    // Show checkout button and summary when cart has items
    if (checkoutBtn) {
      checkoutBtn.style.display = 'block';
    }
    if (cartSummary) {
      cartSummary.style.display = 'block';
    }

    cartData.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-page-item';
      const itemName = item.name.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const itemAlt = (item.alt || item.name).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      
      // Generate a unique identifier for this cart item
      const itemIdentifier = item.cartItemId || `${item.id || item.name}_${item.price}`;
      
      itemElement.innerHTML = `
        <div class="cart-page-item-image">
          <img src="${item.image}" alt="${itemAlt}" onerror="this.onerror=null; this.style.display='none';">
        </div>
        <div class="cart-page-item-details">
          <h4>${itemName}</h4>
          <p class="cart-page-item-price">${formatPrice(item.price)}</p>
          <div class="cart-page-item-quantity">
            <button class="quantity-btn" data-action="decrease" data-cart-item-id="${itemIdentifier}" aria-label="Decrease quantity">−</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-cart-item-id="${itemIdentifier}" aria-label="Quantity">
            <button class="quantity-btn" data-action="increase" data-cart-item-id="${itemIdentifier}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-page-item-total">
          <span class="item-total-price">${formatPrice(item.price * item.quantity)}</span>
          <button class="remove-item-btn" data-cart-item-id="${itemIdentifier}" aria-label="Remove item">Remove</button>
        </div>
      `;
      
      if (cartPageItems) {
        cartPageItems.appendChild(itemElement);
      }
    });

    // Attach event listeners
    attachCartPageListeners();
    updateTotals(cartData.total, shippingCost);
  }

  // Attach event listeners for cart page
  function attachCartPageListeners() {
    // Quantity buttons
    document.querySelectorAll('.cart-page-item .quantity-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const cartItemId = this.getAttribute('data-cart-item-id');
        const action = this.getAttribute('data-action');
        const cartItem = this.closest('.cart-page-item');
        if (!cartItem) return;
        
        const input = cartItem.querySelector('.quantity-input');
        if (!input) return;
        
        if (action === 'increase') {
          const newQuantity = parseInt(input.value) + 1;
          updateItemQuantity(cartItemId, newQuantity);
        } else if (action === 'decrease') {
          const newQuantity = Math.max(1, parseInt(input.value) - 1);
          updateItemQuantity(cartItemId, newQuantity);
        }
      });
    });

    // Quantity input changes
    document.querySelectorAll('.cart-page-item .quantity-input').forEach(input => {
      input.addEventListener('change', function() {
        const cartItemId = this.getAttribute('data-cart-item-id');
        const newQuantity = parseInt(this.value) || 1;
        updateItemQuantity(cartItemId, newQuantity);
      });
    });

    // Remove buttons
    document.querySelectorAll('.cart-page-item .remove-item-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const cartItemId = this.getAttribute('data-cart-item-id');
        
        // Use custom confirmation modal if available, otherwise fallback to native confirm
        const confirmRemove = window.showConfirmModal 
          ? window.showConfirmModal('Remove this item from cart?', 'Remove Item')
          : Promise.resolve(confirm('Remove this item from cart?'));
        
        confirmRemove.then((confirmed) => {
          if (confirmed) {
            removeItem(cartItemId);
          }
        });
      });
    });
  }

  // Update item quantity
  function updateItemQuantity(cartItemId, newQuantity) {
    try {
      // Load cart from localStorage
      const storedCart = localStorage.getItem('elemental_fox_cart');
      if (!storedCart) return;
      
      const cart = JSON.parse(storedCart);
      
      // Find item by cartItemId or generate one to match
      let item = cart.find(item => item.cartItemId === cartItemId);
      
      // If not found, try to match by generating the same ID
      if (!item) {
        item = cart.find(item => {
          const generatedId = item.cartItemId || `${item.id || item.name}_${item.price}`;
          return generatedId === cartItemId;
        });
      }
      
      if (item) {
        item.quantity = Math.max(1, Math.floor(newQuantity));
        
        // Save cart
        localStorage.setItem('elemental_fox_cart', JSON.stringify(cart));
        
        // Update cart API if available
        if (window.cartAPI && window.cartAPI.saveCart) {
          window.cartAPI.saveCart();
        }
        
        // Reload cart page
        const cartData = loadCartData();
        displayCartItems(cartData);
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  }

  // Remove item
  function removeItem(cartItemId) {
    try {
      // Load cart from localStorage
      const storedCart = localStorage.getItem('elemental_fox_cart');
      if (!storedCart) {
        // Reload cart page to show empty state
        const cartData = loadCartData();
        displayCartItems(cartData);
        return;
      }
      
      const cart = JSON.parse(storedCart);
      
      // Filter out the item
      const updatedCart = cart.filter(item => {
        const itemId = item.cartItemId || `${item.id || item.name}_${item.price}`;
        return itemId !== cartItemId;
      });
      
      // Save updated cart
      localStorage.setItem('elemental_fox_cart', JSON.stringify(updatedCart));
      
      // Update cart API if available
      if (window.cartAPI && window.cartAPI.saveCart) {
        window.cartAPI.saveCart();
      }
      
      // Reload cart page
      const cartData = loadCartData();
      displayCartItems(cartData);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  // Calculate shipping
  function calculateShipping() {
    const country = document.getElementById('shipping-country').value;
    const state = document.getElementById('shipping-state').value;
    const zip = document.getElementById('shipping-zip').value;
    
    if (!zip) {
      if (window.showInfo) {
        window.showInfo('Please enter a postal/zip code to calculate shipping.');
      } else {
        alert('Please enter a postal/zip code to calculate shipping.');
      }
      return;
    }
    
    // Simple shipping calculation (you can customize this)
    const cartData = loadCartData();
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      if (window.showInfo) {
        window.showInfo('Your cart is empty.');
      } else {
        alert('Your cart is empty.');
      }
      return;
    }
    
    // Show loading state
    const calculateBtn = document.getElementById('calculate-shipping-btn');
    let originalText = '';
    if (calculateBtn) {
      calculateBtn.disabled = true;
      calculateBtn.classList.add('button-loading');
      originalText = calculateBtn.textContent;
      calculateBtn.textContent = 'Calculating...';
    }
    
    const subtotal = cartData.total;
    
    // Shipping rates (customize these)
    let baseShipping = 0;
    if (country === 'US') {
      if (subtotal >= 150) {
        baseShipping = 0; // Free shipping over $150
      } else {
        baseShipping = 12.00; // Standard US shipping
      }
    } else if (country === 'CA') {
      baseShipping = 25.00; // Canada shipping
    } else {
      baseShipping = 35.00; // International shipping
    }
    
    shippingCost = baseShipping;
    
    // Display shipping result
    const shippingResult = document.getElementById('shipping-result');
    const shippingCostDisplay = document.getElementById('shipping-cost');
    
    if (shippingResult) {
      shippingResult.style.display = 'block';
    }
    if (shippingCostDisplay) {
      shippingCostDisplay.textContent = formatPrice(shippingCost);
    }
    
    // Update totals
    updateTotals(subtotal, shippingCost);
    
    // Remove loading state
    if (calculateBtn) {
      calculateBtn.disabled = false;
      calculateBtn.classList.remove('button-loading');
      calculateBtn.textContent = originalText;
    }
    
    // Show success message
    if (window.showSuccess) {
      window.showSuccess(`Shipping calculated: ${formatPrice(shippingCost)}`);
    }
  }

  // Update totals
  function updateTotals(subtotal, shipping) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) {
      subtotalEl.textContent = formatPrice(subtotal);
    }
    if (shippingEl) {
      shippingEl.textContent = formatPrice(shipping);
    }
    if (totalEl) {
      totalEl.textContent = formatPrice(subtotal + shipping);
    }
  }

  let eventListenersSetup = false;

  // Setup event listeners using event delegation to avoid issues
  function setupEventListeners() {
    if (eventListenersSetup) {
      console.log('Event listeners already set up, skipping...');
      return;
    }
    
    console.log('Setting up cart page event listeners...');
    
    // Use event delegation on the document to catch clicks
    document.addEventListener('click', function(e) {
      // Calculate shipping button
      if (e.target && e.target.id === 'calculate-shipping-btn') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Calculate shipping clicked');
        calculateShipping();
        return;
      }
      
      // Proceed to checkout button - check both direct click and if clicked element is inside button
      const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
      if (checkoutBtn && (e.target === checkoutBtn || checkoutBtn.contains(e.target))) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Checkout button clicked!');
        
        const cartData = loadCartData();
        console.log('Cart data on checkout click:', cartData);
        
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          if (window.showInfo) {
            window.showInfo('Your cart is empty.');
          } else {
            alert('Your cart is empty.');
          }
          return;
        }
        
        // Store cart data with shipping for checkout
        try {
          const checkoutData = {
            ...cartData,
            shipping: shippingCost,
            shippingCountry: document.getElementById('shipping-country')?.value || '',
            shippingState: document.getElementById('shipping-state')?.value || '',
            shippingZip: document.getElementById('shipping-zip')?.value || ''
          };
          console.log('Storing checkout data:', checkoutData);
          sessionStorage.setItem('checkout_cart', JSON.stringify(checkoutData));
          console.log('Redirecting to checkout...');
          window.location.href = 'checkout.html';
        } catch (error) {
          console.error('Error storing checkout data:', error);
          const errorMsg = 'Error proceeding to checkout. Please try again.';
          if (window.showError) {
            window.showError(errorMsg);
          } else {
            alert(errorMsg);
          }
        }
        return;
      }
    });
    
    // Also try direct attachment as backup
    setTimeout(function() {
      const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
      if (checkoutBtn && !checkoutBtn.hasAttribute('data-listener-attached')) {
        checkoutBtn.setAttribute('data-listener-attached', 'true');
        checkoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Checkout button clicked (direct listener)!');
          
          const cartData = loadCartData();
          if (!cartData || !cartData.items || cartData.items.length === 0) {
            if (window.showInfo) {
              window.showInfo('Your cart is empty.');
            } else {
              alert('Your cart is empty.');
            }
            return;
          }
          
          try {
            const checkoutData = {
              ...cartData,
              shipping: shippingCost,
              shippingCountry: document.getElementById('shipping-country')?.value || '',
              shippingState: document.getElementById('shipping-state')?.value || '',
              shippingZip: document.getElementById('shipping-zip')?.value || ''
            };
            sessionStorage.setItem('checkout_cart', JSON.stringify(checkoutData));
            window.location.href = 'checkout.html';
          } catch (error) {
            console.error('Error storing checkout data:', error);
            const errorMsg = 'Error proceeding to checkout. Please try again.';
            if (window.showError) {
              window.showError(errorMsg);
            } else {
              alert(errorMsg);
            }
          }
        });
        console.log('Direct checkout button listener also attached');
      }
    }, 300);
    
    eventListenersSetup = true;
    console.log('Event listeners set up');
  }

  // Initialize cart page
  function initCartPage() {
    console.log('Initializing cart page...');
    
    // Setup event listeners immediately (they use delegation so button doesn't need to exist yet)
    setupEventListeners();
    
    // Wait a bit for cart.js to initialize if needed
    setTimeout(function() {
      // Load and display cart
      const cartData = loadCartData();
      console.log('Cart data loaded:', cartData);
      displayCartItems(cartData);
    }, 200);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
  } else {
    initCartPage();
  }
})();

