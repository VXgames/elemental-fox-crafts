/**
 * Wishlist/Favorites System
 * Handles wishlist functionality, localStorage, and UI updates
 */

(function() {
  'use strict';

  // Wishlist state
  let wishlist = [];
  const WISHLIST_STORAGE_KEY = 'elemental_fox_wishlist';
  let isUpdatingWishlist = false; // Flag to prevent infinite loops

  // Initialize wishlist from localStorage
  function initWishlist() {
    try {
      // Use safe storage if available, otherwise fallback to direct localStorage
      if (window.safeStorage) {
        wishlist = window.safeStorage.get(WISHLIST_STORAGE_KEY, []);
      } else {
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          wishlist = window.safeJsonParse ? window.safeJsonParse(storedWishlist, []) : JSON.parse(storedWishlist);
        } else {
          wishlist = [];
        }
      }
      
      // Validate wishlist data structure
      if (!Array.isArray(wishlist)) {
        console.warn('Wishlist data is not an array, resetting wishlist');
        wishlist = [];
      }
      
      // Only update UI if DOM is ready
      if (document.readyState !== 'loading') {
        updateWishlistUI();
        updateWishlistBadge();
      }
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'wishlist_init', {
          showToUser: false,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM
        });
      } else {
        console.error('Error loading wishlist from localStorage:', error);
      }
      wishlist = [];
    }
  }

  // Save wishlist to localStorage
  function saveWishlist() {
    if (isUpdatingWishlist) {
      console.warn('Wishlist update already in progress, skipping duplicate call...');
      return;
    }
    
    try {
      isUpdatingWishlist = true;
      
      // Use safe storage if available
      if (window.safeStorage) {
        const saved = window.safeStorage.set(WISHLIST_STORAGE_KEY, wishlist);
        if (!saved) {
          console.warn('Failed to save wishlist to storage, but continuing with UI update');
        }
      } else {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      }
      
      updateWishlistUI();
      updateWishlistBadge();
      updateWishlistButtons();
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'wishlist_save', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH
        });
      } else {
        console.error('Error saving wishlist to localStorage:', error);
        if (window.showError) {
          window.showError('Unable to save wishlist. Your changes may be lost.');
        }
      }
    } finally {
      setTimeout(() => {
        isUpdatingWishlist = false;
      }, 100);
    }
  }

  // Generate unique wishlist item ID
  function generateWishlistItemId(product) {
    // Use product ID if available, otherwise create ID from name and price
    if (product.id) {
      return `wishlist_${product.id}`;
    }
    const name = (product.name || '').trim();
    const price = product.price || '';
    return `wishlist_${name}_${price}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  // Check if product is in wishlist
  function isInWishlist(product) {
    const itemId = generateWishlistItemId(product);
    return wishlist.some(item => item.wishlistItemId === itemId);
  }

  // Add item to wishlist
  function addToWishlist(product) {
    try {
      if (!product || !product.name) {
        console.warn('addToWishlist called without valid product');
        return false;
      }

      const wishlistItemId = generateWishlistItemId(product);
      
      // Check if item already exists
      const existingItem = wishlist.find(item => item.wishlistItemId === wishlistItemId);
      if (existingItem) {
        if (window.showInfo) {
          window.showInfo('Item is already in your wishlist');
        }
        return false;
      }

      // Parse price
      const price = typeof product.price === 'number' 
        ? product.price 
        : parseFloat((product.price || '0').replace(/[^0-9.]/g, '')) || 0;

      // Add to wishlist
      wishlist.push({
        wishlistItemId: wishlistItemId,
        id: product.id || null,
        name: product.name,
        price: price,
        image: product.image || '',
        alt: product.alt || product.name,
        link: product.link || null,
        addedDate: new Date().toISOString()
      });

      saveWishlist();
      
      // Show notification
      if (window.showCartNotification) {
        window.showCartNotification('Added to wishlist!');
      } else if (window.showSuccess) {
        window.showSuccess('Added to wishlist!');
      }
      
      // Announce to screen readers
      if (window.A11y && window.A11y.announce) {
        window.A11y.announce(`${product.name} added to wishlist`);
      }
      
      return true;
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'wishlist_add_item', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM
        });
      } else {
        console.error('Error adding item to wishlist:', error);
        if (window.showError) {
          window.showError('Unable to add item to wishlist. Please try again.');
        }
      }
      return false;
    }
  }

  // Remove item from wishlist
  function removeFromWishlist(wishlistItemId) {
    try {
      if (!wishlistItemId) {
        console.warn('removeFromWishlist called without wishlistItemId');
        return false;
      }
      
      const itemCount = wishlist.length;
      const removedItem = wishlist.find(item => item.wishlistItemId === wishlistItemId);
      wishlist = wishlist.filter(item => item.wishlistItemId !== wishlistItemId);
      
      if (wishlist.length === itemCount) {
        console.warn('Item not found in wishlist:', wishlistItemId);
        return false;
      }
      
      saveWishlist();
      
      // Show notification
      if (window.showCartNotification) {
        window.showCartNotification('Removed from wishlist');
      } else if (window.showInfo) {
        window.showInfo('Removed from wishlist');
      }
      
      // Announce to screen readers
      if (window.A11y && window.A11y.announce && removedItem) {
        window.A11y.announce(`${removedItem.name} removed from wishlist`);
      }
      
      return true;
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'wishlist_remove_item', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM
        });
      } else {
        console.error('Error removing item from wishlist:', error);
      }
      return false;
    }
  }

  // Toggle item in wishlist
  function toggleWishlist(product) {
    if (isInWishlist(product)) {
      const wishlistItemId = generateWishlistItemId(product);
      return removeFromWishlist(wishlistItemId);
    } else {
      return addToWishlist(product);
    }
  }

  // Get wishlist count
  function getWishlistCount() {
    return wishlist.length;
  }

  // Get wishlist data
  function getWishlistData() {
    return {
      items: wishlist.map(item => ({
        wishlistItemId: item.wishlistItemId,
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        alt: item.alt,
        link: item.link,
        addedDate: item.addedDate
      })),
      itemCount: wishlist.length
    };
  }

  // Clear wishlist
  function clearWishlist() {
    wishlist = [];
    saveWishlist();
  }

  // Update wishlist badge
  function updateWishlistBadge() {
    const badge = document.querySelector('.wishlist-badge');
    const count = getWishlistCount();
    
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  // Update wishlist buttons (heart icons) on the page
  function updateWishlistButtons() {
    // Update all wishlist buttons based on current wishlist state
    document.querySelectorAll('[data-wishlist-item-id]').forEach(button => {
      const wishlistItemId = button.getAttribute('data-wishlist-item-id');
      const isInList = wishlist.some(item => item.wishlistItemId === wishlistItemId);
      
      if (isInList) {
        button.classList.add('in-wishlist');
        const currentLabel = button.getAttribute('aria-label') || '';
        button.setAttribute('aria-label', currentLabel.replace(/Add/g, 'Remove') || 'Remove from wishlist');
        button.setAttribute('title', 'Remove from wishlist');
        
        // Update text for product detail page button
        const textSpan = button.querySelector('.wishlist-btn-text');
        if (textSpan) {
          textSpan.textContent = 'Remove from Wishlist';
        }
      } else {
        button.classList.remove('in-wishlist');
        const currentLabel = button.getAttribute('aria-label') || '';
        button.setAttribute('aria-label', currentLabel.replace(/Remove/g, 'Add') || 'Add to wishlist');
        button.setAttribute('title', 'Add to wishlist');
        
        // Update text for product detail page button
        const textSpan = button.querySelector('.wishlist-btn-text');
        if (textSpan) {
          textSpan.textContent = 'Add to Wishlist';
        }
      }
    });
  }

  // Update wishlist UI (for wishlist page)
  function updateWishlistUI() {
    const wishlistContainer = document.querySelector('.wishlist-items');
    const wishlistEmpty = document.querySelector('.wishlist-empty');
    const wishlistCount = document.querySelector('.wishlist-count');
    
    if (!wishlistContainer) {
      // Wishlist container doesn't exist on this page (expected on non-wishlist pages)
      return;
    }

    if (wishlist.length === 0) {
      // Show empty wishlist message
      if (wishlistEmpty) wishlistEmpty.style.display = 'block';
      wishlistContainer.innerHTML = '';
      if (wishlistCount) wishlistCount.textContent = '0';
      return;
    }

    // Hide empty wishlist message
    if (wishlistEmpty) wishlistEmpty.style.display = 'none';
    if (wishlistCount) wishlistCount.textContent = wishlist.length.toString();

    // Clear and populate wishlist items
    wishlistContainer.innerHTML = '';
    wishlist.forEach(item => {
      const wishlistItem = document.createElement('div');
      wishlistItem.className = 'wishlist-item';
      
      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        if (window.Security && window.Security.escapeHtml) {
          return window.Security.escapeHtml(text);
        }
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      const formatPrice = (price) => {
        if (typeof price === 'number') {
          return `$${price.toFixed(2)}`;
        }
        return price || 'Price on request';
      };
      
      const itemName = escapeHtml(item.name);
      const itemAlt = escapeHtml(item.alt || item.name);
      const itemImage = escapeHtml(item.image || '');
      const itemPrice = formatPrice(item.price);
      const itemLink = item.link || `product-detail.html?id=${item.id || ''}`;
      const wishlistItemId = escapeHtml(item.wishlistItemId);
      
      wishlistItem.innerHTML = `
        <div class="wishlist-item-image">
          <a href="${itemLink}">
            <img src="${itemImage}" alt="${itemAlt}" onerror="this.onerror=null; this.style.display='none';">
          </a>
        </div>
        <div class="wishlist-item-details">
          <h3 class="wishlist-item-name">
            <a href="${itemLink}">${itemName}</a>
          </h3>
          <p class="wishlist-item-price">${itemPrice}</p>
          <div class="wishlist-item-actions">
            <button class="btn-primary add-to-cart-from-wishlist" 
                    data-wishlist-item-id="${wishlistItemId}"
                    aria-label="Add ${itemName} to cart">
              Add to Cart
            </button>
            <button class="btn-secondary remove-from-wishlist" 
                    data-wishlist-item-id="${wishlistItemId}"
                    aria-label="Remove ${itemName} from wishlist">
              Remove
            </button>
          </div>
        </div>
      `;
      
      wishlistContainer.appendChild(wishlistItem);
    });

    // Attach event listeners for remove buttons
    wishlistContainer.querySelectorAll('.remove-from-wishlist').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const wishlistItemId = this.getAttribute('data-wishlist-item-id');
        if (wishlistItemId) {
          removeFromWishlist(wishlistItemId);
        }
      });
    });

    // Attach event listeners for add to cart buttons
    wishlistContainer.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const wishlistItemId = this.getAttribute('data-wishlist-item-id');
        const item = wishlist.find(w => w.wishlistItemId === wishlistItemId);
        if (item && window.addToCart) {
          const productData = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            alt: item.alt
          };
          window.addToCart(productData);
        }
      });
    });
  }

  // Initialize wishlist UI
  function initWishlistUI() {
    // Set up event delegation for wishlist buttons
    document.addEventListener('click', function(e) {
      const wishlistBtn = e.target.closest('.wishlist-btn, [data-wishlist-toggle]');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get product data from data attributes or closest product card
        const productData = {
          id: wishlistBtn.getAttribute('data-product-id') || null,
          name: wishlistBtn.getAttribute('data-product-name') || '',
          price: wishlistBtn.getAttribute('data-product-price') || '0',
          image: wishlistBtn.getAttribute('data-product-image') || '',
          alt: wishlistBtn.getAttribute('data-product-alt') || wishlistBtn.getAttribute('data-product-name') || '',
          link: wishlistBtn.getAttribute('data-product-link') || null
        };
        
        if (productData.name) {
          toggleWishlist(productData);
        }
      }
    });

    // Update wishlist buttons on page load
    updateWishlistButtons();
  }

  // Make wishlist functions available globally
  window.wishlistAPI = {
    getWishlist: () => wishlist,
    getWishlistData: getWishlistData,
    addToWishlist: addToWishlist,
    removeFromWishlist: removeFromWishlist,
    toggleWishlist: toggleWishlist,
    isInWishlist: isInWishlist,
    getWishlistCount: getWishlistCount,
    clearWishlist: clearWishlist,
    updateWishlistUI: updateWishlistUI,
    updateWishlistBadge: updateWishlistBadge
  };

  // Initialize when DOM is ready
  function initializeWishlist() {
    initWishlist();
    initWishlistUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWishlist);
  } else {
    // DOM is already ready, but wait a bit to ensure all scripts are loaded
    setTimeout(initializeWishlist, 50);
  }
})();

