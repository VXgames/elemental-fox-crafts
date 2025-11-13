// Subcategory Page Loader
// This script automatically populates subcategory pages (product listings) from JSON files
(function() {
  'use strict';
  
  // Function to convert Windows paths to web paths
  function convertImagePath(path) {
    if (!path) return '';
    let imagePath = path.replace(/\\/g, '/');
    // Convert relative paths to absolute paths for Cloudflare Pages compatibility
    // Absolute paths (starting with /) work consistently regardless of URL structure
    if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
      // Remove leading ./ if present, then add leading /
      imagePath = imagePath.replace(/^\.\//, '');
      if (!imagePath.startsWith('/')) {
        imagePath = '/' + imagePath;
      }
    }
    return imagePath;
  }
  
  // Function to load and render subcategory products
  async function loadSubcategoryProducts() {
    try {
      // Get the current page filename to determine which JSON to load
      const currentPage = window.location.pathname.split('/').pop() || 'product-bodkins.html';
      // Remove .html extension if present, then ensure .json extension
      let jsonFile = currentPage.replace(/\.html$/, '');
      if (!jsonFile.endsWith('.json')) {
        jsonFile = jsonFile + '.json';
      }
      // Use absolute path (starting with /) to ensure consistent resolution on Cloudflare Pages
      // This works regardless of whether URL has .html extension or trailing slash
      const jsonPath = `/assets/data/${jsonFile}`;
      
      // Enhanced logging for debugging
      console.log('=== Subcategory Loader Debug ===');
      console.log('Current page:', currentPage);
      console.log('JSON file:', jsonFile);
      console.log('Full JSON path:', jsonPath);
      console.log('Window location:', window.location.href);
      console.log('Window pathname:', window.location.pathname);
      console.log('===============================');
      
      // Fetch the subcategory data using safe fetch if available
      let response;
      let data;
      let responseText;
      
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
            showError: false, // Don't show error here, we'll handle it ourselves
            context: 'subcategory_loader'
          });
          
          // Check response status
          if (!response) {
            throw new Error('No response from server');
          }
          
          if (!response.ok) {
            // Try to get response text to see what the server returned
            let errorResponseText = '';
            try {
              errorResponseText = await response.text();
              console.error('Server error response (first 500 chars):', errorResponseText.substring(0, 500));
            } catch (e) {
              // Ignore errors reading error response
            }
            
            const status = response.status;
            const statusText = response.statusText;
            const errorMsg = `HTTP ${status}: ${statusText}. Path: ${jsonPath}`;
            console.error(errorMsg);
            
            if (status === 404) {
              throw new Error(`JSON file not found: ${jsonPath}. Please verify the file exists on the server.`);
            } else {
              throw new Error(`Server error (${status}): ${statusText}. Path: ${jsonPath}`);
            }
          }
          
          // Check content type
          const contentType = response.headers.get('content-type') || '';
          console.log('Response content type:', contentType, 'for path:', jsonPath);
          
          // Get response text first
          responseText = await response.text();
          
          // Check if response is empty
          if (!responseText || responseText.trim().length === 0) {
            throw new Error('Empty response from server');
          }
          
          // Check if response looks like HTML (error page) - even if status was 200
          const trimmedText = responseText.trim();
          if (trimmedText.startsWith('<') || trimmedText.startsWith('<!')) {
            console.error('Server returned HTML instead of JSON. Response preview:', responseText.substring(0, 500));
            console.error('Response headers:', Object.fromEntries(response.headers.entries()));
            throw new Error(`Server returned HTML error page instead of JSON for ${jsonPath}. The file may not exist or the server may be misconfigured.`);
          }
          
          // Check if content type indicates HTML (even if response doesn't start with <)
          if (contentType.includes('text/html') || contentType.includes('text/plain')) {
            console.warn('Unexpected content type for JSON file:', contentType);
            // Still try to parse, but this is suspicious
          }
          
          // Try to parse JSON
          try {
            data = window.safeJsonParse ? window.safeJsonParse(responseText, null) : JSON.parse(responseText);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text (first 500 chars):', responseText.substring(0, 500));
            console.error('Response content type:', contentType);
            console.error('Response status:', response.status);
            console.error('Response URL:', response.url);
            throw new Error(`Invalid JSON format: ${parseError.message}. Server may have returned an error page. Path: ${jsonPath}`);
          }
          
          if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
            throw new Error('Failed to parse subcategory data - parsed data is not a valid object or array');
          }
        } catch (error) {
          // Add more context to the error
          console.error('Error loading subcategory JSON:', error);
          console.error('Attempted path:', jsonPath);
          console.error('Current page:', currentPage);
          console.error('Constructed JSON file:', jsonFile);
          
          // Re-throw with enhanced context
          if (error.message && !error.message.includes(jsonPath)) {
            error.message = `${error.message} (Path: ${jsonPath})`;
          }
          throw error;
        }
      } else {
        // Fallback to regular fetch
        response = await fetch(jsonPath);
        
        // Check response status
        if (!response.ok) {
          // Try to get response text for better error message
          try {
            responseText = await response.text();
            console.error('Server response (first 500 chars):', responseText.substring(0, 500));
          } catch (e) {
            // Ignore errors reading response text
          }
          const errorMsg = `Failed to load product data: ${response.status} ${response.statusText}. Path: ${jsonPath}`;
          console.error(errorMsg);
          if (window.showError) {
            window.showError(`Unable to load products (${response.status}). Please check that the JSON file exists.`);
          }
          throw new Error(errorMsg);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json') && !contentType.includes('text/json')) {
          console.warn('Unexpected content type:', contentType, 'for path:', jsonPath);
        }
        
        // Get response text first to check if it's valid JSON
        responseText = await response.text();
        
        // Check if response is empty or HTML (error page)
        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from server');
        }
        
        // Check if response looks like HTML (starts with <)
        if (responseText.trim().startsWith('<')) {
          console.error('Server returned HTML instead of JSON. Response preview:', responseText.substring(0, 200));
          throw new Error('Server returned HTML error page instead of JSON. The JSON file may not exist on the server.');
        }
        
        // Try to parse JSON with better error handling
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text (first 500 chars):', responseText.substring(0, 500));
          console.error('Response content type:', contentType);
          const errorMsg = `Invalid JSON format: ${parseError.message}. Please check the JSON file syntax or verify the file exists on the server.`;
          if (window.showError) {
            window.showError('Invalid product data format. Please check the JSON file.');
          }
          throw new Error(errorMsg);
        }
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
        
        // Generate wishlist item ID
        const wishlistItemId = product.id ? `wishlist_${product.id}` : `wishlist_${product.name.replace(/[^a-zA-Z0-9_]/g, '_')}_${product.price}`;
        
        // Create the card HTML with responsive images and lazy loading
        card.innerHTML = `
          <div class="product-image">
            <button class="wishlist-btn" 
                    data-wishlist-toggle
                    data-wishlist-item-id="${wishlistItemId}"
                    data-product-id="${product.id || ''}" 
                    data-product-name="${product.name.replace(/"/g, '&quot;')}" 
                    data-product-price="${product.price}" 
                    data-product-image="${imagePath.replace(/"/g, '&quot;')}" 
                    data-product-alt="${(product.alt || product.name).replace(/"/g, '&quot;')}"
                    data-product-link="${productPageUrl.replace(/"/g, '&quot;')}"
                    aria-label="Add ${product.name.replace(/"/g, '')} to wishlist"
                    title="Add to wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
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
        // Use Security.escapeHtml if available to prevent XSS
        const escapeHtml = (text) => {
          if (window.Security && window.Security.escapeHtml) {
            return window.Security.escapeHtml(String(text || ''));
          }
          const div = document.createElement('div');
          div.textContent = text || '';
          return div.innerHTML;
        };
        
        let errorMessage = 'Unable to load products. Please refresh the page and try again.';
        if (!window.ErrorHandler && error && error.message) {
          errorMessage = error.message;
        }
        
        // Extract the JSON path from error message if available
        const jsonPathMatch = errorMessage.match(/Path: ([^\s)]+)/);
        const displayedPath = jsonPathMatch ? jsonPathMatch[1] : jsonPath || 'unknown';
        
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #d32f2f;">
            <p><strong>Error loading products</strong></p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">${escapeHtml(errorMessage)}</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #666;">
              <strong>Attempted file:</strong> ${escapeHtml(displayedPath)}
            </p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #666;">
              Please check the browser console for more details. If this is a live server, verify that the JSON file exists at the correct path.
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

