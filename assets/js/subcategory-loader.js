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
      
      // Fetch the subcategory data
      const response = await fetch(jsonPath);
      
      if (!response.ok) {
        const errorMsg = `Failed to load product data: ${response.status} ${response.statusText}`;
        console.error(errorMsg);
        if (window.showError) {
          window.showError('Unable to load products. Please refresh the page and try again.');
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
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
        
        // Create the card HTML with responsive images
        card.innerHTML = `
          <div class="product-image">
            <img src="${imagePath}" 
                 alt="${product.alt || product.name}"
                 ${product.imageSmall && product.imageLarge ? `
                 srcset="${imageSmall} 400w,
                         ${imagePath} 800w,
                         ${imageLarge} 1200w"
                 sizes="(max-width: 768px) 100vw, 400px"` : ''}
                 onerror="this.onerror=null; console.error('Failed to load image: ${imagePath}');">
          </div>
          <h3>${product.name}</h3>
          <p class="price">${product.price}</p>
          <button class="btn-secondary add-to-cart-btn" 
                  data-product-id="${product.id || ''}" 
                  data-product-name="${product.name.replace(/"/g, '&quot;')}" 
                  data-product-price="${product.price}" 
                  data-product-image="${imagePath.replace(/"/g, '&quot;')}" 
                  data-product-alt="${(product.alt || product.name).replace(/"/g, '&quot;')}">
            Add to Cart
          </button>
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
    } catch (error) {
      console.error('Error loading subcategory products:', error);
      console.error('Error details:', error.message);
      
      // Show user-friendly error message
      const errorMsg = 'Unable to load products. Please refresh the page and try again.';
      if (window.showError) {
        window.showError(errorMsg);
      }
      
      // Show error message on page
      const productsGrid = document.querySelector('.products-grid');
      if (productsGrid) {
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #d32f2f;">
            <p><strong>Error loading products:</strong> ${error.message}</p>
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

