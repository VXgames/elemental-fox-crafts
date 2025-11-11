// Featured Items Loader
// This script automatically populates the mega-menu featured items from a JSON file
(function() {
  'use strict';
  
  // Function to load and render featured items
  async function loadFeaturedItems() {
    try {
      // Fetch the featured items data
      const response = await fetch('./assets/data/featured-items.json');
      if (!response.ok) {
        throw new Error('Failed to load featured items');
      }
      
      const data = await response.json();
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
          
          // Create the card HTML
          card.innerHTML = `
            <div class="preview-image">
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

