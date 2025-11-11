// Search, Filter, and Sort functionality
// Works with dynamically loaded products from JSON files
(function() {
  'use strict';

  // Global state
  let allProducts = [];
  let filteredProducts = [];
  let currentFilters = {
    search: '',
    category: 'all',
    minPrice: null,
    maxPrice: null,
    sortBy: 'name' // 'name', 'price-low', 'price-high', 'newest'
  };

  // Initialize search/filter system
  function init() {
    // Always setup search bar (works on all pages)
    setupSearchBar();

    // Check if this page has products to filter
    const productsGrid = document.querySelector('.products-grid');
    const favoritesGrid = document.querySelector('.favorites-grid');
    const hasProducts = productsGrid || favoritesGrid;

    if (!hasProducts) {
      // No products on this page, search will navigate to shop page
      return;
    }

    // Check if this is a shop page or category page
    const isShopPage = document.querySelector('.shop-filters-container') !== null;
    const isCategoryPage = window.location.pathname.includes('category-') || 
                          window.location.pathname.includes('product-');

    if (isShopPage) {
      setupShopPageFilters();
    }

    // Collect all products from the page
    collectProducts();

    // Setup filter/sort event listeners
    setupEventListeners();
  }

  // Setup search bar in header
  function setupSearchBar() {
    const searchBar = document.getElementById('header-search');
    if (!searchBar) return;

    // Check if we have products on this page
    const hasProducts = document.querySelector('.products-grid') || 
                       document.querySelector('.favorites-grid');

    // Search on input (with debounce) - filter if products exist
    // Use performance optimizer's debounce if available
    const debouncedSearch = window.debounce ? 
      window.debounce(function(searchValue) {
        if (hasProducts && allProducts.length > 0) {
          currentFilters.search = searchValue.toLowerCase();
          applyFilters();
        }
      }, 300) :
      (function() {
        let searchTimeout;
        return function(searchValue) {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            if (hasProducts && allProducts.length > 0) {
              currentFilters.search = searchValue.toLowerCase();
              applyFilters();
            }
          }, 300);
        };
      })();
    
    searchBar.addEventListener('input', function(e) {
      const searchValue = e.target.value.trim();
      debouncedSearch(searchValue);
      // Otherwise, wait for Enter to navigate to shop page
    });

    // Search on Enter key - always navigate to shop page with search
    searchBar.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const searchValue = e.target.value.trim();
        
        if (!searchValue) return;
        
        // Always navigate to shop page with search query to show all matching products
        window.location.href = `shop.html?search=${encodeURIComponent(searchValue)}`;
      }
    });
    
    // Also allow clicking the search icon to search
    const searchIcon = searchBar.parentElement?.querySelector('.search-icon');
    if (searchIcon) {
      searchIcon.style.cursor = 'pointer';
      searchIcon.addEventListener('click', function() {
        const searchValue = searchBar.value.trim();
        if (!searchValue) return;
        window.location.href = `shop.html?search=${encodeURIComponent(searchValue)}`;
      });
    }
  }

  // Setup filter controls for shop page
  function setupShopPageFilters() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      currentFilters.search = searchParam.toLowerCase().trim();
      const searchInput = document.getElementById('header-search');
      if (searchInput) {
        searchInput.value = searchParam;
      }
    }
  }

  // Collect all products from the page
  function collectProducts() {
    allProducts = [];
    // Look for products in both .products-grid and .favorites-grid
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      const product = {
        element: card,
        name: card.querySelector('h3, h4')?.textContent?.trim() || '',
        price: extractPrice(card.querySelector('.price')?.textContent || ''),
        category: extractCategory(card),
        description: card.querySelector('.category-description, .product-details p')?.textContent?.trim() || '',
        link: card.querySelector('a')?.href || card.closest('a')?.href || '',
        image: card.querySelector('img')?.src || '',
        alt: card.querySelector('img')?.alt || ''
      };
      
      if (product.name) {
        allProducts.push(product);
      }
    });

    filteredProducts = [...allProducts];
    console.log(`Collected ${allProducts.length} products for search/filter`);
  }

  // Extract numeric price from price string
  function extractPrice(priceText) {
    if (!priceText) return 0;
    const match = priceText.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  // Extract category from product card
  function extractCategory(card) {
    // Try to find category from various sources
    const categoryLink = card.querySelector('a[href*="category-"]');
    if (categoryLink) {
      const href = categoryLink.getAttribute('href');
      if (href.includes('weaving')) return 'Weaving Tools';
      if (href.includes('copper')) return 'Copper Works';
      if (href.includes('cattoys') || href.includes('cat-toys')) return 'Cat Toys';
      if (href.includes('knives')) return 'Knives';
      if (href.includes('wands')) return 'Magic Wands';
      if (href.includes('jewellery') || href.includes('Jewellery')) return 'Jewellery';
    }
    return 'Other';
  }

  // Setup event listeners for filters and sorting
  function setupEventListeners() {
    // Category filter
    const categoryFilter = document.getElementById('filter-category');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', function(e) {
        currentFilters.category = e.target.value;
        applyFilters();
      });
    }

    // Price range filters
    const minPriceFilter = document.getElementById('filter-min-price');
    const maxPriceFilter = document.getElementById('filter-max-price');
    
    if (minPriceFilter) {
      // Handle both input and change events for real-time filtering
      // Use performance optimizer's debounce if available
      const debouncedMinPriceFilter = window.debounce ? 
        window.debounce(function(value) {
          currentFilters.minPrice = value && !isNaN(value) ? parseFloat(value) : null;
          applyFilters();
        }, 300) :
        (function() {
          let timeout;
          return function(value) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              currentFilters.minPrice = value && !isNaN(value) ? parseFloat(value) : null;
              applyFilters();
            }, 300);
          };
        })();
      
      minPriceFilter.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        debouncedMinPriceFilter(value);
      });
      minPriceFilter.addEventListener('change', function(e) {
        const value = e.target.value.trim();
        currentFilters.minPrice = value && !isNaN(value) ? parseFloat(value) : null;
        applyFilters();
      });
    }
    
    if (maxPriceFilter) {
      // Handle both input and change events for real-time filtering
      // Use performance optimizer's debounce if available
      const debouncedMaxPriceFilter = window.debounce ? 
        window.debounce(function(value) {
          currentFilters.maxPrice = value && !isNaN(value) ? parseFloat(value) : null;
          applyFilters();
        }, 300) :
        (function() {
          let timeout;
          return function(value) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              currentFilters.maxPrice = value && !isNaN(value) ? parseFloat(value) : null;
              applyFilters();
            }, 300);
          };
        })();
      
      maxPriceFilter.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        debouncedMaxPriceFilter(value);
      });
      maxPriceFilter.addEventListener('change', function(e) {
        const value = e.target.value.trim();
        currentFilters.maxPrice = value && !isNaN(value) ? parseFloat(value) : null;
        applyFilters();
      });
    }

    // Sort dropdown
    const sortFilter = document.getElementById('filter-sort');
    if (sortFilter) {
      sortFilter.addEventListener('change', function(e) {
        currentFilters.sortBy = e.target.value;
        applyFilters();
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function() {
        clearFilters();
      });
    }
  }

  // Apply all filters and sorting
  async function applyFilters() {
    console.log('Applying filters:', currentFilters);
    console.log('Total products before filter:', allProducts.length);
    
    // Check if we have any active filters (excluding default sort)
    const hasActiveFilters = 
      currentFilters.search || 
      currentFilters.category !== 'all' || 
      currentFilters.minPrice !== null || 
      currentFilters.maxPrice !== null;
    
    // Check if we're on shop page and have category cards (which don't have prices)
    const isShopPage = document.querySelector('.shop-filters-container') !== null;
    const hasPriceFilters = currentFilters.minPrice !== null || currentFilters.maxPrice !== null;
    const hasOnlyCategoryCards = isShopPage && allProducts.length > 0 && 
                                allProducts.every(p => (p.price === 0 || p.price === undefined || isNaN(p.price)));
    
    // If we have price filters or other active filters and only category cards, load all products
    if (hasActiveFilters && (allProducts.length === 0 || (hasPriceFilters && hasOnlyCategoryCards))) {
      console.log('Active filters detected. Loading all products from JSON files...');
      try {
        await loadAllProductsForFiltering();
        console.log('Products loaded, now filtering...');
        // Continue to filter below
      } catch (error) {
        console.error('Error loading products for filtering:', error);
        if (window.showError) {
          window.showError('Failed to load products for filtering. Please try again.');
        }
        return;
      }
    }
    
    filteredProducts = allProducts.filter(product => {
      // Search filter
      if (currentFilters.search) {
        const searchTerm = currentFilters.search;
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm)) ||
          (product.category && product.category.toLowerCase().includes(searchTerm));
        if (!matchesSearch) {
          return false;
        }
      }

      // Category filter
      if (currentFilters.category !== 'all') {
        if (product.category !== currentFilters.category) {
          return false;
        }
      }

      // Price filters - only apply if product has a valid price > 0
      if (hasPriceFilters) {
        const productPrice = product.price;
        // Skip products with no price or price = 0 when price filters are active
        if (!productPrice || productPrice === 0 || isNaN(productPrice)) {
          return false;
        }
        
        if (currentFilters.minPrice !== null && productPrice < currentFilters.minPrice) {
          return false;
        }
        if (currentFilters.maxPrice !== null && productPrice > currentFilters.maxPrice) {
          return false;
        }
      }

      return true;
    });
    
    console.log(`Filtered to ${filteredProducts.length} products out of ${allProducts.length}`);
    
    // Log sample of filtered products for debugging
    if (filteredProducts.length > 0 && filteredProducts.length <= 10) {
      console.log('Filtered products:', filteredProducts.map(p => ({
        name: p.name,
        price: p.price,
        category: p.category
      })));
    } else if (filteredProducts.length > 10) {
      console.log('Sample filtered products (first 5):', filteredProducts.slice(0, 5).map(p => ({
        name: p.name,
        price: p.price,
        category: p.category
      })));
    } else {
      console.warn('No products matched the filters!');
      // Log sample of all products to see what we have
      if (allProducts.length > 0) {
        console.log('Sample of all products (first 5):', allProducts.slice(0, 5).map(p => ({
          name: p.name,
          price: p.price,
          category: p.category
        })));
      }
    }

    // Sort products
    sortProducts();

    // Update display
    updateDisplay();

    // Update results count
    updateResultsCount();
    
    // Announce search results to screen readers
    if (window.A11y && window.A11y.announceSearchResults) {
      const searchQuery = currentFilters.search || '';
      window.A11y.announceSearchResults(filteredProducts.length, searchQuery);
    }
  }

  // Sort products based on current sort option
  function sortProducts() {
    switch (currentFilters.sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // For newest, we'll keep original order (assumes products are added in order)
        // You could add a date field to products if needed
        break;
      default:
        break;
    }
  }

  // Update product display
  function updateDisplay() {
    // Find the container (could be .products-grid or .favorites-grid)
    const productsGrid = document.querySelector('.products-grid') || 
                        document.querySelector('.favorites-grid');
    if (!productsGrid) {
      console.warn('Products grid not found for display update');
      return;
    }

    // If we have products but they don't have DOM elements, we need to create them
    // This happens when we load products from JSON files
    if (filteredProducts.length > 0 && (!filteredProducts[0].element || filteredProducts[0].element === null)) {
      console.log('Products loaded from JSON, creating DOM elements for', filteredProducts.length, 'products...');
      createProductCardsFromData(filteredProducts, productsGrid);
      // Update allProducts to include element references for the filtered products
      filteredProducts.forEach(filteredProduct => {
        const existingProduct = allProducts.find(p => 
          p.name === filteredProduct.name && 
          p.price === filteredProduct.price &&
          p.category === filteredProduct.category
        );
        if (existingProduct && filteredProduct.element) {
          existingProduct.element = filteredProduct.element;
        }
      });
      return;
    }

    // If we have DOM elements, hide/show them
    if (allProducts.length > 0 && allProducts[0].element) {
      // Hide all products first
      allProducts.forEach(product => {
        if (product.element) {
          product.element.style.display = 'none';
        }
      });

      // Clear and re-append filtered products in sorted order
      productsGrid.innerHTML = '';
      filteredProducts.forEach(product => {
        if (product.element) {
          product.element.style.display = '';
          productsGrid.appendChild(product.element);
        }
      });
    }
  }
  
  // Create product cards from product data (when loading from JSON)
  function createProductCardsFromData(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      const productSlug = product.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const productPageUrl = product.link || `product-detail.html?id=${product.id || ''}&slug=${productSlug}`;
      const productPrice = product.price > 0 ? `$${product.price.toFixed(2)}` : 'Price on request';
      
      card.innerHTML = `
        <div class="product-image">
          <a href="${productPageUrl}">
            <img src="${escapeHtml(product.image)}" 
                 alt="${escapeHtml(product.alt || product.name)}"
                 loading="lazy"
                 onerror="this.onerror=null; this.style.display='none';">
          </a>
        </div>
        <h3><a href="${productPageUrl}" style="text-decoration: none; color: inherit;">${escapeHtml(product.name)}</a></h3>
        ${product.description ? `<p class="category-description">${escapeHtml(product.description)}</p>` : ''}
        <p class="price">${productPrice}</p>
        ${product.price > 0 ? `
        <button class="btn-secondary add-to-cart-btn" 
                data-product-name="${escapeHtml(product.name)}" 
                data-product-price="${productPrice}" 
                data-product-image="${escapeHtml(product.image)}" 
                data-product-alt="${escapeHtml(product.alt || product.name)}"
                aria-label="Add ${escapeHtml(product.name)} to cart">
          Add to Cart
        </button>
        ` : ''}
        <a href="${productPageUrl}" class="btn-secondary" style="margin-top: 0.5rem; display: inline-block; width: 100%; text-align: center; box-sizing: border-box;" aria-label="View details for ${escapeHtml(product.name)}">View Details</a>
      `;
      
      // Add to cart functionality
      const addToCartBtn = card.querySelector('.add-to-cart-btn');
      if (addToCartBtn && window.addToCart) {
        addToCartBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const productData = {
            name: product.name,
            price: productPrice,
            image: product.image,
            alt: product.alt || product.name
          };
          if (window.addToCart) {
            window.addToCart(productData);
          }
        });
      }
      
      // Store element reference
      product.element = card;
      container.appendChild(card);
    });
  }
  
  // Escape HTML helper
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
  
  // Convert Windows paths to web paths
  function convertImagePath(path) {
    if (!path) return '';
    let imagePath = path.replace(/\\/g, '/');
    if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
      imagePath = './' + imagePath;
    }
    return imagePath;
  }

  // Update results count display
  function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      const total = allProducts.length;
      const filtered = filteredProducts.length;
      if (filtered === total) {
        resultsCount.textContent = `Showing ${total} products`;
      } else {
        resultsCount.textContent = `Showing ${filtered} of ${total} products`;
      }
    }
  }

  // Load all products from JSON files for filtering (when filters are applied)
  async function loadAllProductsForFiltering() {
    const productDataFiles = [
      './assets/data/category-weaving.json',
      './assets/data/category-copper.json',
      './assets/data/category-cattoys.json',
      './assets/data/category-knives.json',
      './assets/data/category-wands.json',
      './assets/data/Jewellery.json',
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

    const loadedProducts = [];
    
    console.log('Loading all products from JSON files for filtering...');
    
    for (const filePath of productDataFiles) {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          console.warn(`Failed to load ${filePath}: ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        
        // Handle category files (subcategories) - only include if no price filters are active
        // Subcategories don't have prices, so they should be skipped when filtering by price
        if (data.subcategories && Array.isArray(data.subcategories)) {
          const hasPriceFilters = currentFilters.minPrice !== null || currentFilters.maxPrice !== null;
          // Skip subcategories if price filters are active (they don't have prices)
          if (!hasPriceFilters) {
            data.subcategories.forEach(item => {
              const price = extractPrice(item.price || '');
              loadedProducts.push({
                name: item.name,
                description: item.description || '',
                price: price, // Will be 0 for subcategories
                category: data.category?.name || data.subcategory?.name || 'Unknown',
                link: item.link || '',
                image: convertImagePath(item.image),
                alt: item.alt || item.name,
                id: item.id || null
              });
            });
          }
        }
        
        // Handle product files (individual products)
        if (data.products && Array.isArray(data.products)) {
          data.products.forEach(item => {
            let price = 0;
            if (item.price) {
              if (typeof item.price === 'string') {
                price = extractPrice(item.price);
              } else if (typeof item.price === 'number') {
                price = item.price;
              }
            }
            
            loadedProducts.push({
              name: item.name,
              description: item.description || '',
              price: price,
              category: data.subcategory?.name || data.category?.name || 'Unknown',
              link: item.link || '',
              image: convertImagePath(item.image || item.imageSmall || item.imageLarge),
              alt: item.alt || item.name,
              id: item.id || null
            });
          });
        }
      } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
      }
    }
    
    console.log(`Loaded ${loadedProducts.length} products from JSON files`);
    
    // Replace allProducts with loaded products
    allProducts = loadedProducts.map(product => ({
      ...product,
      element: null // Will be created in updateDisplay
    }));
    
    // Hide category cards section on shop page
    const isShopPage = document.querySelector('.shop-filters-container') !== null;
    if (isShopPage) {
      console.log('Shop page detected - products loaded from JSON for filtering');
    }
    
    return loadedProducts;
  }

  // Clear all filters
  function clearFilters() {
    currentFilters = {
      search: '',
      category: 'all',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name'
    };

    // Reset form inputs
    const searchInput = document.getElementById('header-search');
    if (searchInput) searchInput.value = '';

    const categoryFilter = document.getElementById('filter-category');
    if (categoryFilter) categoryFilter.value = 'all';

    const minPriceFilter = document.getElementById('filter-min-price');
    if (minPriceFilter) {
      minPriceFilter.value = '';
      minPriceFilter.placeholder = '0';
    }

    const maxPriceFilter = document.getElementById('filter-max-price');
    if (maxPriceFilter) {
      maxPriceFilter.value = '';
      maxPriceFilter.placeholder = '999';
    }

    const sortFilter = document.getElementById('filter-sort');
    if (sortFilter) sortFilter.value = 'name';

    // On shop page, if we loaded products, reload page to show categories again
    const isShopPage = document.querySelector('.shop-filters-container') !== null;
    if (isShopPage && allProducts.length > 0) {
      // Check if current products have prices (meaning they're from JSON, not categories)
      const hasProductsWithPrices = allProducts.some(p => p.price > 0);
      if (hasProductsWithPrices) {
        // Reload page to show categories again
        console.log('Clearing filters - reloading page to show categories');
        window.location.href = 'shop.html';
        return;
      }
    }

    // Re-collect products from page
    collectProducts();
    
    // Apply filters (which will show all products)
    applyFilters();
  }

  // Public API for external use
  window.searchFilter = {
    collectProducts: collectProducts,
    applyFilters: applyFilters,
    clearFilters: clearFilters
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready, but wait a bit for dynamic content to load
    setTimeout(init, 500);
  }

  // Re-collect products after dynamic content loads
  // This is useful for pages that load products via JSON
  window.addEventListener('load', function() {
    setTimeout(() => {
      // Re-collect products and re-apply filters if search is active
      const hasProducts = document.querySelector('.products-grid') || 
                         document.querySelector('.favorites-grid');
      if (hasProducts) {
        collectProducts();
        if (currentFilters.search) {
          applyFilters();
        }
      }
    }, 1000);
  });

})();

