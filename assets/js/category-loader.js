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
      let jsonFile = currentPage.replace('.html', '');
      // Ensure .json extension is added
      if (!jsonFile.endsWith('.json')) {
        jsonFile = jsonFile + '.json';
      }
      const jsonPath = `./assets/data/${jsonFile}`;
      
      console.log('Loading category data from:', jsonPath);
      console.log('Current page:', currentPage);
      console.log('JSON file:', jsonFile);
      
      // Fetch the category data
      const response = await fetch(jsonPath);
      
      if (!response.ok) {
        const errorMsg = `Failed to load category data: ${response.status} ${response.statusText}`;
        console.error(errorMsg);
        console.error('Response URL:', response.url);
        if (window.showError) {
          window.showError('Unable to load category. Please refresh the page.');
        }
        throw new Error(errorMsg);
      }
      
      // Get response text first to check what we actually received
      const responseText = await response.text();
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON but got content-type:', contentType);
        console.error('Response text (first 500 chars):', responseText.substring(0, 500));
        
        // Check if it's an HTML error page
        if (responseText.trim().startsWith('<')) {
          const errorMsg = 'Server returned an HTML error page instead of JSON. The JSON file may not exist or the path is incorrect.';
          console.error('HTML response detected. This usually means a 404 error page.');
          if (window.showError) {
            window.showError('Category data file not found. Please check the file path.');
          }
          throw new Error(errorMsg);
        }
        
        const errorMsg = 'Server returned non-JSON response. Please check the JSON file exists and is valid.';
        if (window.showError) {
          window.showError('Unable to load category data. Please check the server configuration.');
        }
        throw new Error(errorMsg);
      }
      
      // Try to parse JSON with better error handling
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text (first 500 chars):', responseText.substring(0, 500));
        const errorMsg = `Invalid JSON format: ${parseError.message}. Please check the JSON file syntax.`;
        if (window.showError) {
          window.showError('Invalid category data format. Please check the JSON file.');
        }
        throw new Error(errorMsg);
      }
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
      console.error('Error stack:', error.stack);
      
      // Show user-friendly error message
      let errorMsg = 'Unable to load subcategories. Please refresh the page and try again.';
      
      // Provide more specific error messages
      if (error.message.includes('JSON')) {
        errorMsg = 'Invalid JSON data. Please check the JSON file format.';
      } else if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
        errorMsg = 'Category data file not found. Please check the file path.';
      } else if (error.message.includes('non-JSON')) {
        errorMsg = 'Server returned invalid data. Please check your web server configuration.';
      }
      
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
              <strong>Note:</strong> If you're opening this file directly (file://), you need to use a local web server.
              <br>Try: <code>python -m http.server 8000</code> or use VS Code's Live Server extension.
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

