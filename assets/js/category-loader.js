// Category Page Loader
// This script automatically populates category pages (subcategory listings) from JSON files
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
  
  // Function to load and render category subcategories
  async function loadCategorySubcategories() {
    try {
      // Get the current page filename to determine which JSON to load
      const currentPage = window.location.pathname.split('/').pop() || 'category-weaving.html';
      const jsonFile = currentPage.replace('.html', '.json');
      const jsonPath = `./assets/data/${jsonFile}`;
      
      console.log('Loading category data from:', jsonPath);
      
      // Fetch the category data
      const response = await fetch(jsonPath);
      
      if (!response.ok) {
        const errorMsg = `Failed to load category data: ${response.status} ${response.statusText}`;
        console.error(errorMsg);
        if (window.showError) {
          window.showError('Unable to load category. Please refresh the page.');
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      console.log('Category data loaded successfully:', data);
      
      // Update page header if category info exists
      if (data.category) {
        const pageHeader = document.querySelector('.page-header h2');
        const pageDescription = document.querySelector('.page-header .about-text');
        
        if (pageHeader && data.category.name) {
          pageHeader.textContent = data.category.name;
        }
        if (pageDescription && data.category.description) {
          pageDescription.textContent = data.category.description;
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
      
      // Check if we have subcategories
      if (!data.subcategories || data.subcategories.length === 0) {
        console.error('No subcategories found in JSON data');
        if (window.showInfo) {
          window.showInfo('No subcategories available in this category.');
        }
        return;
      }
      
      console.log(`Found ${data.subcategories.length} subcategories`);
      
      // Clear existing content
      productsGrid.innerHTML = '';
      
      // Create product cards for each subcategory
      data.subcategories.forEach((subcategory, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Convert image paths
        const imagePath = convertImagePath(subcategory.image);
        const imageSmall = convertImagePath(subcategory.imageSmall || subcategory.image);
        const imageLarge = convertImagePath(subcategory.imageLarge || subcategory.image);
        
        console.log(`Subcategory ${index + 1}: ${subcategory.name}, Image path: ${imagePath}`);
        
        // Create the card HTML with responsive images
        card.innerHTML = `
          <a href="${subcategory.link}" class="product-link">
            <div class="product-image">
              <img src="${imagePath}" 
                   alt="${subcategory.alt || subcategory.name}"
                   ${subcategory.imageSmall && subcategory.imageLarge ? `
                   srcset="${imageSmall} 400w,
                           ${imagePath} 800w,
                           ${imageLarge} 1200w"
                   sizes="(max-width: 768px) 100vw, 400px"` : ''}
                   onerror="console.error('Failed to load image: ${imagePath}')">
            </div>
            <h3>${subcategory.name}</h3>
            <p class="category-description">${subcategory.description}</p>
            <span class="btn-secondary">View Collection</span>
          </a>
        `;
        
        // Append to grid
        productsGrid.appendChild(card);
      });
      
      console.log('Category subcategories loaded successfully!');
    } catch (error) {
      console.error('Error loading category subcategories:', error);
      console.error('Error details:', error.message);
      
      // Show user-friendly error message
      const errorMsg = 'Unable to load subcategories. Please refresh the page and try again.';
      if (window.showError) {
        window.showError(errorMsg);
      }
      
      // Show error message on page
      const productsGrid = document.querySelector('.products-grid');
      if (productsGrid) {
        productsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #d32f2f;">
            <p><strong>Error loading subcategories:</strong> ${error.message}</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check the browser console for more details.</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #666;">
              <strong>Note:</strong> If you're opening this file directly (file://), you may need to use a local web server.
            </p>
          </div>
        `;
      }
    }
  }
  
  // Load category subcategories when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCategorySubcategories);
  } else {
    loadCategorySubcategories();
  }
})();

