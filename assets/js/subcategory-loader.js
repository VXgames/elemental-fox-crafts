// Subcategory Page Loader
// This script automatically populates subcategory pages (product listings) from JSON files
(function() {
  'use strict';
  
  // Function to convert Windows paths to web paths
  function convertImagePath(path) {
    if (!path) return '';
    let imagePath = path.replace(/\\/g, '/');
    if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
      imagePath = './' + imagePath;
    }
    return imagePath;
  }
  
  // Function to load and render subcategory products
  async function loadSubcategoryProducts() {
    try {
      // Get the current page filename to determine which JSON to load
      const currentPage = window.location.pathname.split('/').pop() || 'product-bodkins.html';
      const jsonFile = currentPage.replace('.html', '.json');
      const jsonPath = `./assets/data/${jsonFile}`;
      
      console.log('Loading subcategory data from:', jsonPath);
      
      // Fetch the subcategory data using safe fetch if available
      let response;
      let data;
      
      // Use cached fetch if available for better performance
      if (window.cachedFetch) {
        try {
          data = await window.cachedFetch(jsonPath, {
            timeout: 10000,
            showError: true,
            context: 'subcategory_loader'
          });
          
          if (!data) {
            throw new Error('Failed to parse subcategory data');
          }
        } catch (error) {
          // Error already handled, but throw to stop execution
          throw error;
        }
      } else if (window.safeFetch) {
        try {
          response = await window.safeFetch(jsonPath, {
            timeout: 10000,
            showError: true,
            context: 'subcategory_loader'
          });
          
          const responseText = await response.text();
          data = window.safeJsonParse ? window.safeJsonParse(responseText, null) : JSON.parse(responseText);
          
          if (!data) {
            throw new Error('Failed to parse subcategory data');
          }
        } catch (error) {
          // Error already handled by safeFetch
          throw error;
        }
      } else {
        // Fallback to regular fetch
        response = await fetch(jsonPath);
        
        if (!response.ok) {
          const errorMsg = `Failed to load product data: ${response.status} ${response.statusText}`;
          console.error(errorMsg);
          if (window.showError) {
            window.showError('Unable to load products. Please refresh the page and try again.');
          }
          throw new Error(errorMsg);
        }
        
        data = await response.json();
      }
      console.log('Subcategory data loaded successfully:', data);
      
      // Update page header if subcategory info exists
      if (data.subcategory) {
        const pageHeader = document.querySelector('.page-header h2');
        const pageDescription = document.querySelector('.page-header .about-text');
        
        if (pageHeader && data.subcategory.name) {
          pageHeader.textContent = data.subcategory.name;
        }
        if (pageDescription && data.subcategory.description) {
          pageDescription.textContent = data.subcategory.description;
        }
      }
      
      // Find the products grid container
      const productsGrid = document.querySelector('.products-grid');
      
      if (!productsGrid) {
        console.error('Products grid container not found!');
        if (window.showError) {
          window.showError('Page structure error. Please refresh the page.');
        }
        return;
      }
      
      // Check if we have products
      if (!data.products || data.products.length === 0) {
        console.error('No products found in JSON data');
        if (window.showInfo) {
          window.showInfo('No products available in this category.');
        }
        return;
      }
      
      console.log(`Found ${data.products.length} products`);
      
      // Clear existing content
      productsGrid.innerHTML = '';
      
      // Create product cards for each product
      data.products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Convert image paths
        const imagePath = convertImagePath(product.image);
        const imageSmall = convertImagePath(product.imageSmall || product.image);
        const imageLarge = convertImagePath(product.imageLarge || product.image);
        
        console.log(`Product ${index + 1}: ${product.name}, Image path: ${imagePath}`);
        
        // Generate product page URL
        const productSlug = product.slug || product.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const productPageUrl = product.link || `product-detail.html?id=${product.id || index + 1}&slug=${productSlug}`;
        
        // Create the card HTML with responsive images and lazy loading
        card.innerHTML = `
          <div class="product-image">
            <a href="${productPageUrl}">
              <img src="${imagePath}" 
                   alt="${product.alt || product.name}"
                   ${product.imageSmall && product.imageLarge ? `
                   srcset="${imageSmall} 400w,
                           ${imagePath} 800w,
                           ${imageLarge} 1200w"
                   sizes="(max-width: 768px) 100vw, 400px"` : ''}
                   loading="lazy"
                   onerror="this.onerror=null; this.style.display='none';">
            </a>
          </div>
          <h3><a href="${productPageUrl}" style="text-decoration: none; color: inherit;">${product.name}</a></h3>
          <p class="price">${product.price}</p>
          <button class="btn-secondary add-to-cart-btn" 
                  data-product-id="${product.id || ''}" 
                  data-product-name="${product.name.replace(/"/g, '&quot;')}" 
                  data-product-price="${product.price}" 
                  data-product-image="${imagePath.replace(/"/g, '&quot;')}" 
                  data-product-alt="${(product.alt || product.name).replace(/"/g, '&quot;')}"
                  aria-label="Add ${product.name.replace(/"/g, '')} to cart">
            Add to Cart
          </button>
          <a href="${productPageUrl}" class="btn-secondary" style="margin-top: 0.5rem; display: inline-block; width: 100%; text-align: center; box-sizing: border-box;" aria-label="View details for ${product.name.replace(/"/g, '')}">View Details</a>
        `;
        
        // Append to grid
        productsGrid.appendChild(card);
        
        // Attach click handler to Add to Cart button
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
          addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get product data directly from the product object (more reliable than data attributes)
            const productData = {
              id: product.id || null,
              name: product.name,
              price: product.price,
              image: imagePath, // Use the converted path
              alt: product.alt || product.name
            };
            
            console.log('Adding product to cart:', productData);
            
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
          console.warn('Add to Cart button not found for product:', product.name);
        }
      });
      
      console.log('Subcategory products loaded successfully!');
      
      // Trigger product collection for search/filter after a short delay
      if (window.searchFilter && window.searchFilter.collectProducts) {
        setTimeout(() => {
          window.searchFilter.collectProducts();
        }, 100);
      }
    } catch (error) {
      // Use error handler if available
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'subcategory_loader', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH
        });
      } else {
        console.error('Error loading subcategory products:', error);
        console.error('Error details:', error.message);
        const errorMsg = 'Unable to load products. Please refresh the page and try again.';
        if (window.showError) {
          window.showError(errorMsg);
        }
      }
      
      // Show error message on page
      const productsGrid = document.querySelector('.products-grid');
      if (productsGrid) {
        const errorMessage = window.ErrorHandler 
          ? 'Unable to load products. Please refresh the page and try again.'
          : error.message || 'Unable to load products.';
          
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #d32f2f;">
            <p><strong>Error loading products:</strong> ${errorMessage}</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check the browser console for more details.</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #666;">
              <strong>Note:</strong> If you're opening this file directly (file://), you may need to use a local web server.
            </p>
          </div>
        `;
      }
    }
  }
  
  // Load subcategory products when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSubcategoryProducts);
  } else {
    loadSubcategoryProducts();
  }
})();

