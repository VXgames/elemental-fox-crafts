// Shop Categories Loader
// This script automatically populates the shop page category cards from a JSON file
(function() {
  'use strict';
  
  // Function to load and render shop categories
  async function loadShopCategories() {
    try {
      // Check if we're showing search results - if so, don't load categories
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('search');
      if (searchQuery) {
        console.log('Search query detected, skipping category loading');
        return;
      }

      console.log('Loading shop categories...');
      
      // Find the products grid container first
      const productsGrid = document.querySelector('.products-grid');
      
      if (!productsGrid) {
        console.error('Products grid container not found!');
        return; // Exit if products grid doesn't exist
      }
      
      console.log('Products grid found, fetching JSON...');
      
      // Fetch the shop categories data using cached fetch if available
      let data;
      
      if (window.cachedFetch) {
        try {
          data = await window.cachedFetch('./assets/data/shop-categories.json', {
            timeout: 10000,
            showError: true,
            context: 'shop_categories_loader'
          });
          
          if (!data) {
            throw new Error('Failed to parse shop categories data');
          }
        } catch (error) {
          // Error already handled, but throw to stop execution
          throw error;
        }
      } else {
        // Fallback to regular fetch
        const response = await fetch('./assets/data/shop-categories.json');
        
        if (!response.ok) {
          const errorMsg = `Failed to load shop categories: ${response.status} ${response.statusText}`;
          console.error(errorMsg);
          if (window.showError) {
            window.showError('Unable to load categories. Please refresh the page.');
          }
          throw new Error(errorMsg);
        }
        
        data = await response.json();
      }
      console.log('JSON loaded successfully:', data);
      
      const categories = data.categories;
      
      if (!categories || categories.length === 0) {
        console.error('No categories found in JSON data');
        if (window.showInfo) {
          window.showInfo('No categories available.');
        }
        return;
      }
      
      console.log(`Found ${categories.length} categories`);
      
      // Clear existing content
      productsGrid.innerHTML = '';
      
      // Create product cards for each category
      categories.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Convert Windows-style paths (backslashes) to web paths (forward slashes)
        // This allows copying Windows file paths directly into JSON
        // Handles both .\assets\... and \assets\... formats
        let imagePath = category.image.replace(/\\/g, '/');
        
        // Ensure path starts with ./ for relative paths (if it doesn't already start with / or http)
        if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
          imagePath = './' + imagePath;
        }
        
        console.log(`Category ${index + 1}: ${category.name}, Image path: ${imagePath}`);
        
        // Create the card HTML with lazy loading
        card.innerHTML = `
          <a href="${category.link}" class="product-link">
            <div class="product-image">
              <img src="${imagePath}" alt="${category.alt}" loading="lazy" onerror="this.onerror=null; this.style.display='none';">
            </div>
            <h3>${category.name}</h3>
            <p class="category-description">${category.description}</p>
            <span class="btn-secondary">View Collection</span>
          </a>
        `;
        
        // Append to grid
        productsGrid.appendChild(card);
      });
      
      console.log('Shop categories loaded successfully!');
      
      // Trigger product collection for search/filter after a short delay
      if (window.searchFilter && window.searchFilter.collectProducts) {
        setTimeout(() => {
          window.searchFilter.collectProducts();
        }, 100);
      }
    } catch (error) {
      console.error('Error loading shop categories:', error);
      console.error('Error details:', error.message);
      
      // Show user-friendly error message
      const errorMsg = 'Unable to load categories. Please refresh the page and try again.';
      if (window.showError) {
        window.showError(errorMsg);
      }
      
      // Show error message on page
      const productsGrid = document.querySelector('.products-grid');
      if (productsGrid) {
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #d32f2f;">
            <p><strong>Error loading categories:</strong> ${error.message}</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check the browser console for more details.</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #666;">
              <strong>Note:</strong> If you're opening this file directly (file://), you may need to use a local web server.
              <br>Try using a tool like <a href="https://www.npmjs.com/package/http-server" target="_blank">http-server</a> or your code editor's live server feature.
            </p>
          </div>
        `;
      }
    }
  }
  
  // Load shop categories when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadShopCategories);
  } else {
    // DOM is already ready
    loadShopCategories();
  }
})();

