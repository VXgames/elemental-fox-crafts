// Featured Items Loader
// This script automatically populates the mega-menu featured items from a JSON file
(function() {
  'use strict';
  
  // Function to load and render featured items
  async function loadFeaturedItems() {
    try {
      // Fetch the featured items data using safe fetch if available
      let response;
      let data;
      
      // Use cached fetch if available for better performance
      if (window.cachedFetch) {
        try {
          data = await window.cachedFetch('./assets/data/featured-items.json', {
            timeout: 10000,
            showError: false, // Don't show error for featured items (non-critical)
            context: 'featured_items_loader'
          });
          
          if (!data) {
            throw new Error('Failed to parse featured items data');
          }
        } catch (error) {
          // Non-critical error, just log it
          if (window.ErrorHandler) {
            window.ErrorHandler.handle(error, 'featured_items_loader', {
              showToUser: false,
              severity: window.ErrorHandler.ERROR_SEVERITY.LOW,
              silent: true
            });
          } else {
            console.warn('Failed to load featured items:', error);
          }
          return; // Silently fail - featured items are not critical
        }
      } else if (window.safeFetch) {
        try {
          response = await window.safeFetch('./assets/data/featured-items.json', {
            timeout: 10000,
            showError: false, // Don't show error for featured items (non-critical)
            context: 'featured_items_loader'
          });
          
          const responseText = await response.text();
          data = window.safeJsonParse ? window.safeJsonParse(responseText, null) : JSON.parse(responseText);
          
          if (!data) {
            throw new Error('Failed to parse featured items data');
          }
        } catch (error) {
          // Non-critical error, just log it
          if (window.ErrorHandler) {
            window.ErrorHandler.handle(error, 'featured_items_loader', {
              showToUser: false,
              severity: window.ErrorHandler.ERROR_SEVERITY.LOW,
              silent: true
            });
          } else {
            console.warn('Failed to load featured items:', error);
          }
          return; // Silently fail - featured items are not critical
        }
      } else {
        // Fallback to regular fetch
        response = await fetch('./assets/data/featured-items.json');
        if (!response.ok) {
          console.warn('Failed to load featured items');
          return; // Silently fail - featured items are not critical
        }
        
        data = await response.json();
      }
      const featuredItems = data.featuredItems;
      
      // Find all mega-menu containers
      const megaRightContainers = document.querySelectorAll('.mega-right');
      
      megaRightContainers.forEach(container => {
        // Clear existing content
        container.innerHTML = '';
        
        // Create preview cards for each featured item
        featuredItems.forEach(item => {
          const card = document.createElement('div');
          card.className = 'preview-card';
          card.setAttribute('role', 'article');
          
          // Convert Windows-style paths (backslashes) to web paths (forward slashes)
          // This allows copying Windows file paths directly into JSON
          // Handles both .\assets\... and \assets\... formats
          let imagePath = item.image.replace(/\\/g, '/');
          // Ensure path starts with ./ for relative paths (if it doesn't already start with / or http)
          if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
            imagePath = './' + imagePath;
          }
          
          // Build color dots HTML
          const colorDots = item.colors.map(color => 
            `<span class="color-dot" style="background:${color}"></span>`
          ).join('');
          
          // Generate wishlist item ID
          const wishlistItemId = item.id ? `wishlist_${item.id}` : `wishlist_${item.title.replace(/[^a-zA-Z0-9_]/g, '_')}_${item.price}`;
          const productPageUrl = item.link || `product-detail.html?id=${item.id || ''}`;
          
          // Create the card HTML
          card.innerHTML = `
            <div class="preview-image" style="position: relative;">
              <button class="wishlist-btn" 
                      data-wishlist-toggle
                      data-wishlist-item-id="${wishlistItemId}"
                      data-product-id="${item.id || ''}" 
                      data-product-name="${item.title.replace(/"/g, '&quot;')}" 
                      data-product-price="${item.price}" 
                      data-product-image="${imagePath.replace(/"/g, '&quot;')}" 
                      data-product-alt="${item.alt.replace(/"/g, '&quot;')}"
                      data-product-link="${productPageUrl.replace(/"/g, '&quot;')}"
                      aria-label="Add ${item.title.replace(/"/g, '')} to wishlist"
                      title="Add to wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <img src="${imagePath}" alt="${item.alt}">
            </div>
            <h4>${item.title}</h4>
            <div class="price">${item.price}</div>
            <div class="stars">${item.stars}</div>
            <div class="color-dots">${colorDots}</div>
            <button class="btn-secondary add-to-cart-btn" 
                    data-product-id="${item.id || ''}" 
                    data-product-name="${item.title.replace(/"/g, '&quot;')}" 
                    data-product-price="${item.price}" 
                    data-product-image="${imagePath.replace(/"/g, '&quot;')}" 
                    data-product-alt="${item.alt.replace(/"/g, '&quot;')}"
                    aria-label="Add ${item.title.replace(/"/g, '')} to cart"
                    style="margin-top: 0.5rem; width: 100%;">
              Add to Cart
            </button>
          `;
          
          // Append to container
          container.appendChild(card);
          
          // Attach click handler to Add to Cart button
          const addToCartBtn = card.querySelector('.add-to-cart-btn');
          if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation(); // Prevent mega-menu from closing
              
              // Get product data directly from the item object (more reliable than data attributes)
              const productData = {
                id: item.id || null,
                name: item.title, // Featured items use 'title' instead of 'name'
                price: item.price,
                image: imagePath, // Use the converted path
                alt: item.alt
              };
              
              console.log('Adding featured item to cart:', productData);
              
              if (window.addToCart) {
                window.addToCart(productData);
              } else {
                console.error('Cart system not loaded - window.addToCart is not defined');
                const errorMsg = 'Cart system is not ready. Please refresh the page and try again.';
                if (window.showError) {
                  window.showError(errorMsg);
                } else {
                  alert(errorMsg);
                }
              }
            });
          } else {
            console.warn('Add to Cart button not found for featured item:', item.title);
          }
        });
      });
    } catch (error) {
      console.error('Error loading featured items:', error);
      // Fallback: if JSON fails to load, the HTML will show default content
    }
  }
  
  // Load featured items when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFeaturedItems);
  } else {
    // DOM is already ready
    loadFeaturedItems();
  }
})();

