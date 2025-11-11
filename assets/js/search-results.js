// Search Results Page - Loads all products and filters by search query
(function() {
  'use strict';

  // All products from all categories
  let allProducts = [];
  let filteredProducts = [];

  // List of all JSON files to load
  const productDataFiles = [
    // Category files (contain subcategories)
    './assets/data/category-weaving.json',
    './assets/data/category-copper.json',
    './assets/data/category-cattoys.json',
    './assets/data/category-knives.json',
    './assets/data/category-wands.json',
    './assets/data/Jewellery.json',
    // Product files (contain individual products)
    './assets/data/product-bodkins.json',
    './assets/data/product-mallets.json',
    './assets/data/product-4-way-cleave.json',
    './assets/data/product-rapping-irons.json',
    './assets/data/product-heddles-reed-hooks.json',
    './assets/data/product-pickup-sticks.json',
    './assets/data/product-warping-sticks.json',
    './assets/data/product-weaving-forks.json',
    './assets/data/product-tapestry-bobbins.json',
    './assets/data/product-nalbinding-needles.json',
    './assets/data/product-copper-spoons.json',
    './assets/data/product-copper-ladles.json',
    './assets/data/product-copper-jewellery.json',
    './assets/data/product-cattoys-feather.json',
    './assets/data/product-cattoys-fur.json',
    './assets/data/product-cattoys-willow.json',
    './assets/data/product-marking-knives.json',
    './assets/data/product-curved-knives.json',
  ];

  // Initialize search results page
  async function init() {
    console.log('[search-results.js] init() called');
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';
    
    console.log('[search-results.js] Search query:', searchQuery);
    console.log('[search-results.js] Current URL:', window.location.href);
    
    // Check if we're on shop.html
    const isShopPage = window.location.pathname.includes('shop.html');
    console.log('[search-results.js] Is shop page:', isShopPage);
    
    if (!searchQuery) {
      console.log('[search-results.js] No search query, exiting');
      if (isShopPage) {
        // On shop page without search, show normal categories (don't interfere)
        return;
      } else {
        showNoSearchQuery();
        return;
      }
    }

    // If we're on shop.html, show search results instead of categories
    if (isShopPage) {
      const filtersSection = document.querySelector('.shop-filters-container');
      const categoriesGrid = document.querySelector('.products-grid'); // The grid itself, not its parent!
      const searchSection = document.getElementById('search-results-section');
      const pageHeader = document.querySelector('.page-header');
      
      console.log('[search-results.js] Setting up search results display:', {
        filtersSection: !!filtersSection,
        categoriesGrid: !!categoriesGrid,
        searchSection: !!searchSection,
        pageHeader: !!pageHeader
      });
      
      // Hide filters and categories GRID (not the parent main element!)
      if (filtersSection) {
        filtersSection.style.display = 'none';
        console.log('[search-results.js] Hidden filters section');
      }
      if (categoriesGrid) {
        categoriesGrid.style.display = 'none';
        console.log('[search-results.js] Hidden categories grid (not main element)');
      }
      
      // Show search results section FIRST - before loading products
      if (searchSection) {
        // Remove any inline style that hides it
        searchSection.removeAttribute('style');
        // Add class for CSS styling
        searchSection.classList.add('show-results');
        // Set explicit dimensions and display
        searchSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; min-height: 400px !important; padding: 2rem !important; position: relative !important;';
        console.log('[search-results.js] Showing search results section BEFORE loading products');
        console.log('[search-results.js] Section has class show-results:', searchSection.classList.contains('show-results'));
        
        // Also ensure container is ready
        const container = document.getElementById('search-results-container');
        if (container) {
          container.style.cssText = 'width: 100% !important; min-height: 200px !important; display: block !important;';
        }
        
        // Force a reflow to ensure browser processes the display change
        void searchSection.offsetHeight;
        
        console.log('[search-results.js] Section initial offsetHeight:', searchSection.offsetHeight);
      } else {
        console.error('[search-results.js] ERROR: Search results section (#search-results-section) not found in DOM!');
      }
    }

    // Update search input
    const searchInput = document.getElementById('header-search');
    if (searchInput) {
      searchInput.value = searchQuery;
    }

    // Show loading state
    showLoading();

    console.log(`Starting search for: "${searchQuery}"`);

    // Load all products from all JSON files
    await loadAllProducts();
    
    console.log(`Loaded ${allProducts.length} products, filtering for "${searchQuery}"`);

    // Filter products by search query
    filterProducts(searchQuery);
    
    console.log(`Found ${filteredProducts.length} matching products`);

    // Display results
    displayResults();
    
    console.log('Search results displayed');
  }

  // Load all products from all JSON files
  async function loadAllProducts() {
    allProducts = [];
    
    // Use batch fetch for parallel loading if available
    if (window.batchFetch) {
      try {
        const results = await window.batchFetch(productDataFiles, {
          timeout: 10000,
          showError: false,
          context: 'search_results_loader'
        });
        
        results.forEach(({ url, data, error }) => {
          if (error || !data) return;
          processProductData(data, url);
        });
        
        console.log(`Loaded ${allProducts.length} total products (batch)`);
        return;
      } catch (error) {
        console.warn('[Performance] Batch fetch failed, falling back to sequential:', error);
        // Fall through to sequential loading
      }
    }
    
    // Sequential loading (fallback)
    for (const filePath of productDataFiles) {
      try {
        // Use cached fetch if available, otherwise safe fetch
        let data;
        
        if (window.cachedFetch) {
          data = await window.cachedFetch(filePath, {
            timeout: 10000,
            showError: false,
            context: 'search_results_loader'
          });
        } else if (window.safeFetch) {
          try {
            const response = await window.safeFetch(filePath, {
              timeout: 10000,
              showError: false,
              context: 'search_results_loader'
            });
            
            const responseText = await response.text();
            data = window.safeJsonParse ? window.safeJsonParse(responseText, null) : JSON.parse(responseText);
            
            if (!data) continue;
          } catch (error) {
            // Skip this file and continue
            continue;
          }
        } else {
          // Fallback to regular fetch
          const response = await fetch(filePath);
          if (!response.ok) continue;
          
          data = await response.json();
        }
        
        processProductData(data, filePath);
      } catch (error) {
        // Silently continue - don't log errors for individual files
        // Only log if error handler is not available
        if (!window.ErrorHandler) {
          console.error(`Error loading ${filePath}:`, error);
        }
      }
    }

    console.log(`Loaded ${allProducts.length} total products`);
  }

  // Helper function to process product data
  function processProductData(data, filePath) {
    // Handle category files (subcategories) - these are category pages showing subcategories
    if (data.subcategories && Array.isArray(data.subcategories)) {
      data.subcategories.forEach(item => {
        allProducts.push({
          name: item.name,
          description: item.description || '',
          price: extractPrice(item.price || ''),
          image: convertImagePath(item.image),
          link: item.link || '',
          category: data.category?.name || 'Unknown',
          alt: item.alt || item.name,
          type: 'subcategory'
        });
      });
    }
    
    // Handle product files (individual products) - these are product listing pages
    if (data.products && Array.isArray(data.products)) {
      data.products.forEach(item => {
        // Extract price - handle both string "$24.00" and number formats
        let price = 0;
        if (item.price) {
          if (typeof item.price === 'string') {
            price = extractPrice(item.price);
          } else if (typeof item.price === 'number') {
            price = item.price;
          }
        }
        
        allProducts.push({
          name: item.name,
          description: item.description || '',
          price: price,
          image: convertImagePath(item.image || item.imageSmall || item.imageLarge),
          link: item.link || '',
          category: data.subcategory?.name || data.category?.name || 'Unknown',
          alt: item.alt || item.name,
          type: 'product'
        });
      });
    }
  }

  // Convert Windows paths to web paths
  function convertImagePath(path) {
    if (!path) return '';
    let imagePath = path.replace(/\\/g, '/');
    if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
      imagePath = './' + imagePath;
    }
    return imagePath;
  }

  // Extract numeric price from price string
  function extractPrice(priceText) {
    if (!priceText) return 0;
    const match = priceText.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  // Filter products by search query
  function filterProducts(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      filteredProducts = [...allProducts];
      return;
    }

    console.log(`Filtering ${allProducts.length} products for query: "${query}"`);
    
    filteredProducts = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      const catMatch = product.category.toLowerCase().includes(query);
      
      if (nameMatch || descMatch || catMatch) {
        console.log(`Match found: ${product.name} (category: ${product.category})`);
      }
      
      return nameMatch || descMatch || catMatch;
    });
    
    console.log(`Filtered to ${filteredProducts.length} products`);
  }

  // Display search results
  function displayResults() {
    console.log('[search-results.js] displayResults() called');
    const resultsContainer = document.getElementById('search-results-container');
    const resultsCount = document.getElementById('search-results-count');
    const searchSection = document.getElementById('search-results-section');
    const searchQuery = new URLSearchParams(window.location.search).get('search') || '';

    console.log('[search-results.js] Elements found:', {
      resultsContainer: !!resultsContainer,
      resultsCount: !!resultsCount,
      searchSection: !!searchSection,
      filteredProductsCount: filteredProducts.length
    });

    if (!resultsContainer) {
      console.error('[search-results.js] ERROR: Results container not found!');
      // Try to find the section and create container if needed
      if (searchSection) {
        console.log('[search-results.js] Creating results container');
        const newContainer = document.createElement('div');
        newContainer.id = 'search-results-container';
        newContainer.className = 'search-results-container';
        searchSection.appendChild(newContainer);
        // Retry with new container
        return displayResults();
      }
      return;
    }

    // Make sure search section is visible and main element is not hidden
    if (searchSection) {
      // CRITICAL: Ensure main element is visible (it should be, but verify)
      const mainElement = searchSection.closest('main');
      if (mainElement) {
        const mainDisplay = window.getComputedStyle(mainElement).display;
        if (mainDisplay === 'none') {
          console.error('[search-results.js] CRITICAL ERROR: Main element is hidden! This will prevent all content from displaying!');
          console.error('[search-results.js] Making main element visible...');
          mainElement.style.display = 'block';
          mainElement.style.visibility = 'visible';
        } else {
          console.log('[search-results.js] Main element is visible:', mainDisplay);
        }
      }
      
      searchSection.removeAttribute('style');
      searchSection.classList.add('show-results');
      // Add explicit width and min-height to ensure it's visible
      searchSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; min-height: 200px !important;';
      console.log('[search-results.js] Made search section visible in displayResults');
    }

    // Update page header if on shop page
    const pageHeader = document.querySelector('.page-header h2');
    if (pageHeader) {
      pageHeader.textContent = `Search Results for "${searchQuery}"`;
      console.log('[search-results.js] Updated page header');
    }

    // Update results count
    if (resultsCount) {
      if (filteredProducts.length === 0) {
        resultsCount.textContent = `No products found for "${searchQuery}"`;
      } else {
        resultsCount.textContent = `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching "${searchQuery}"`;
      }
      console.log('[search-results.js] Updated results count:', resultsCount.textContent);
      
      // Announce to screen readers
      if (window.A11y && window.A11y.announceSearchResults) {
        window.A11y.announceSearchResults(filteredProducts.length, searchQuery);
      }
    }

    // Clear container
    console.log('[search-results.js] Clearing container and preparing to display', filteredProducts.length, 'products');
    resultsContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <h3>No products found</h3>
          <p>We couldn't find any products matching "${searchQuery}".</p>
          <p>Try searching for something else or <a href="shop.html">browse all products</a>.</p>
        </div>
      `;
      console.log('[search-results.js] Displayed no results message');
      return;
    }

    // Create product cards
    console.log('[search-results.js] Creating products grid with', filteredProducts.length, 'products');
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';

    filteredProducts.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      // Add explicit styling to ensure card is visible and has dimensions
      card.style.cssText = 'position: relative; background: var(--card); border: 1px solid var(--border-green); min-height: 400px; display: flex; flex-direction: column; width: 100%;';
      
      const productLink = product.link || '#';
      const productPrice = product.price > 0 ? `$${product.price.toFixed(2)}` : 'Price on request';
      
      console.log(`[search-results.js] Creating card ${index + 1}/${filteredProducts.length}:`, product.name);
      
      // Use innerHTML for simpler structure - but ensure card has explicit dimensions
      card.innerHTML = `
        <div class="product-image" style="width: 100%; height: 250px; position: relative; overflow: hidden; background: var(--surface); flex-shrink: 0;">
          <a href="${productLink}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block;">
            <img src="${product.image}" 
                 alt="${escapeHtml(product.alt)}" 
                 style="width: 100%; height: 100%; object-fit: cover; display: block;"
                 onerror="this.onerror=null; this.style.display='none';">
          </a>
        </div>
        <div class="product-details" style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; min-height: 150px;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--heading); font-weight: 400;">${escapeHtml(product.name)}</h3>
          ${product.description ? `<p style="margin: 0.5rem 0 1rem 0; font-size: 0.95rem; color: var(--text); line-height: 1.5; flex: 1;">${escapeHtml(product.description)}</p>` : '<div style="flex: 1;"></div>'}
          <p class="price" style="font-size: 1rem; color: var(--text); margin: 0.5rem 0; font-weight: 500;">${productPrice}</p>
          <div style="margin-top: auto; padding-top: 1rem;">
          ${product.price > 0 ? `
          <button class="btn-secondary add-to-cart-btn" 
                  data-product-name="${escapeHtml(product.name)}" 
                  data-product-price="${productPrice}" 
                  data-product-image="${escapeHtml(product.image)}" 
                  data-product-alt="${escapeHtml(product.alt)}"
                  aria-label="Add ${escapeHtml(product.name)} to cart"
                  style="width: 100%; margin-bottom: 0.5rem;">
            Add to Cart
          </button>
          ` : ''}
          <a href="${productLink || `product-detail.html?id=${product.id || ''}&slug=${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}" class="btn-secondary" style="display: inline-block; width: 100%; text-align: center; box-sizing: border-box;" aria-label="View details for ${escapeHtml(product.name)}">View Details</a>
          </div>
        </div>
      `;

      // Add click handler for Add to Cart button
      const addToCartBtn = card.querySelector('.add-to-cart-btn');
      if (addToCartBtn && window.addToCart) {
        addToCartBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const productData = {
            name: product.name,
            price: productPrice,
            image: product.image,
            alt: product.alt
          };
          if (window.addToCart) {
            window.addToCart(productData);
          }
        });
      }

      // Append card to grid
      productsGrid.appendChild(card);
    });
    
    // CRITICAL: Ensure main element is visible BEFORE appending grid
    const mainElement = searchSection?.closest('main');
    if (mainElement) {
      const mainDisplay = window.getComputedStyle(mainElement).display;
      if (mainDisplay === 'none') {
        console.error('[search-results.js] ⚠️ Main element is hidden! Making it visible.');
        mainElement.style.cssText = 'display: block !important; visibility: visible !important; position: relative !important; z-index: 1 !important;';
      }
    }
    
    // Now append the grid to container
    console.log('[search-results.js] Appending products grid to container');
    resultsContainer.appendChild(productsGrid);
    
    // Apply styling to grid
    productsGrid.style.cssText = 'display: grid !important; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important; gap: 2rem !important; padding: 3rem 2rem !important; max-width: 1400px !important; margin: 2rem auto !important; width: 100% !important;';
    
    // Ensure container and section are properly styled
    resultsContainer.style.cssText = 'width: 100% !important; display: block !important; position: relative !important;';
    
    if (searchSection) {
      searchSection.removeAttribute('style');
      searchSection.classList.add('show-results');
      searchSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; padding: 2rem !important; position: relative !important;';
    }
    
    // Force reflow
    void mainElement?.offsetHeight;
    void searchSection?.offsetHeight;
    void resultsContainer.offsetHeight;
    void productsGrid.offsetHeight;
    
    console.log('[search-results.js] Products grid appended. Container children:', resultsContainer.children.length);
    console.log('[search-results.js] Products grid has', productsGrid.children.length, 'product cards');
    
    // Wait for browser to render, then verify
    requestAnimationFrame(() => {
      setTimeout(() => {
        const mainHeight = mainElement?.offsetHeight || 0;
        const sectionHeight = searchSection?.offsetHeight || 0;
        const gridHeight = productsGrid.offsetHeight;
        const cardHeights = Array.from(productsGrid.children).map(card => card.offsetHeight);
        
        console.log('[search-results.js] Final dimensions:', {
          main: mainHeight + 'px',
          section: sectionHeight + 'px',
          grid: gridHeight + 'px',
          cards: cardHeights.filter(h => h > 0).length + '/' + cardHeights.length + ' have height'
        });
        
        // If cards have no height, they're not rendering - check why
        if (cardHeights.every(h => h === 0)) {
          console.error('[search-results.js] All cards have 0 height! Checking main element...');
          if (mainHeight === 0) {
            console.error('[search-results.js] Main element has 0 height - this is the problem!');
            // Force main to be visible with content
            if (mainElement) {
              mainElement.style.cssText = 'display: block !important; visibility: visible !important; position: relative !important; min-height: 500px !important;';
            }
          }
        }
        
        // Scroll into view if we have content
        if (sectionHeight > 0 || gridHeight > 0) {
          searchSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('[search-results.js] ✅ Scrolled into view');
        }
      }, 200);
    });
    
    console.log('[search-results.js] ✅ Search results display complete!');
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    if (window.Security && window.Security.escapeHtml) {
      return window.Security.escapeHtml(text);
    }
    // Fallback
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show loading state
  function showLoading() {
    const resultsContainer = document.getElementById('search-results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-loading">
          <p>Searching products...</p>
        </div>
      `;
    }
  }

  // Show no search query message
  function showNoSearchQuery() {
    const resultsContainer = document.getElementById('search-results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-no-query">
          <h3>Search for products</h3>
          <p>Enter a search term in the search bar above to find products.</p>
          <a href="shop.html" class="btn-primary">Browse All Products</a>
        </div>
      `;
    }
  }

  // Initialize when DOM is ready
  function initializeSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    // Only initialize if there's a search query
    if (!searchQuery) {
      console.log('[search-results.js] No search query in URL, skipping initialization');
      return;
    }
    
    console.log('[search-results.js] Search query detected:', searchQuery);
    console.log('[search-results.js] Document ready state:', document.readyState);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      console.log('[search-results.js] Waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', function() {
        console.log('[search-results.js] DOMContentLoaded fired, initializing');
        setTimeout(init, 100);
      });
    } else {
      // DOM is already ready
      console.log('[search-results.js] DOM already ready, initializing');
      setTimeout(init, 100);
    }
  }

  // Initialize immediately when script loads
  console.log('[search-results.js] Script loaded, checking for search query');
  initializeSearchResults();

  // Also initialize after page loads (in case script loaded late)
  window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('search')) {
      console.log('[search-results.js] Page loaded, re-initializing search results');
      setTimeout(init, 200);
    }
  });

})();

