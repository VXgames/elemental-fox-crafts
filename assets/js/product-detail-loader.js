// Product Detail Page Loader
// Loads individual product data and displays it on the product detail page
(function() {
  'use strict';

  // Get product ID from URL
  function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || urlParams.get('productId');
  }

  // Get product slug from URL (e.g., product-steel-walnut-bodkin-001.html)
  function getProductSlugFromUrl() {
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop();
    // Remove .html extension and 'product-' prefix if present
    return filename.replace(/\.html$/, '').replace(/^product-/, '');
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

  // Find product in all JSON files
  async function findProduct(productId, productSlug) {
    // List of all product JSON files to search
    const productDataFiles = [
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
      './assets/data/Jewellery.json'
    ];

    for (const filePath of productDataFiles) {
      try {
        // Use safe fetch if available
        let response;
        let data;
        
        if (window.safeFetch) {
          try {
            response = await window.safeFetch(filePath, {
              timeout: 10000,
              showError: false, // Don't show error for each file, only if product not found
              context: 'product_detail_loader'
            });
            
            const responseText = await response.text();
            data = window.safeJsonParse ? window.safeJsonParse(responseText, null) : JSON.parse(responseText);
            
            if (!data) continue;
          } catch (error) {
            // Skip this file and continue searching
            continue;
          }
        } else {
          // Fallback to regular fetch
          response = await fetch(filePath);
          if (!response.ok) continue;
          
          data = await response.json();
        }
        
        // Check if this file has products array
        if (data.products && Array.isArray(data.products)) {
          // Search for product by ID or slug
          const product = data.products.find(p => {
            if (productId && p.id && p.id.toString() === productId.toString()) {
              return true;
            }
            if (productSlug && p.slug && p.slug === productSlug) {
              return true;
            }
            // Fallback: match by name (convert to slug-like format)
            if (productSlug && p.name) {
              const nameSlug = p.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
              if (nameSlug.includes(productSlug) || productSlug.includes(nameSlug)) {
                return true;
              }
            }
            return false;
          });
          
          if (product) {
            // Return product with category/subcategory info
            return {
              product: product,
              category: data.category || data.subcategory || { name: 'Unknown' },
              subcategory: data.subcategory || { name: 'Unknown' }
            };
          }
        }
      } catch (error) {
        // Silently continue searching other files
        // Only log if error handler is not available
        if (!window.ErrorHandler) {
          console.error(`Error loading ${filePath}:`, error);
        }
      }
    }
    
    return null;
  }

  // Load product detail data
  async function loadProductDetail() {
    const productId = getProductIdFromUrl();
    const productSlug = getProductSlugFromUrl();
    
    console.log('Loading product detail:', { productId, productSlug });
    
    if (!productId && !productSlug) {
      const error = new Error('No product ID or slug found in URL');
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'product_detail_loader', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
          customMessage: 'Product not found. Please check the URL and try again.'
        });
      } else {
        console.error('No product ID or slug found in URL');
        if (window.showError) {
          window.showError('Product not found. Please check the URL.');
        }
      }
      return;
    }

    // Show loading state
    showLoading();

    try {
      const result = await findProduct(productId, productSlug);
      
      if (!result || !result.product) {
        const error = new Error('Product not found in database');
        if (window.ErrorHandler) {
          window.ErrorHandler.handle(error, 'product_detail_loader', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
            customMessage: 'Product not found. It may have been removed or moved. Please return to the shop.'
          });
        } else {
          console.error('Product not found');
          if (window.showError) {
            window.showError('Product not found. Please check the URL and try again.');
          }
        }
        return;
      }

      const { product, category, subcategory } = result;
      
      console.log('Product found:', product);
      
      // Display product
      displayProduct(product, category, subcategory);
      
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'product_detail_loader', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH,
          customMessage: 'Failed to load product details. Please refresh the page and try again.'
        });
      } else {
        console.error('Error loading product:', error);
        if (window.showError) {
          window.showError('Failed to load product. Please refresh the page and try again.');
        }
      }
    }
  }

  // Display product on page
  function displayProduct(product, category, subcategory) {
    // Update page title
    document.title = `${product.name} - Elemental Fox Crafts`;
    
    // Update breadcrumbs
    updateBreadcrumbs(category, subcategory, product);
    
    // Update product title
    const productTitle = document.getElementById('product-title');
    if (productTitle) {
      productTitle.textContent = product.name;
    }
    
    // Update product price
    const productPrice = document.getElementById('product-price');
    if (productPrice) {
      const price = extractPrice(product.price);
      productPrice.textContent = price > 0 ? `$${price.toFixed(2)}` : 'Price on request';
    }
    
    // Update product description
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
      if (product.fullDescription) {
        productDescription.innerHTML = `<p>${escapeHtml(product.fullDescription)}</p>`;
      } else if (product.description) {
        productDescription.innerHTML = `<p>${escapeHtml(product.description)}</p>`;
      } else {
        productDescription.innerHTML = '<p>No description available.</p>';
      }
    }
    
    // Setup image gallery
    setupImageGallery(product);
    
    // Setup add to cart button
    setupAddToCartButton(product);
    
    // Update additional info
    updateAdditionalInfo(product, category, subcategory);
    
    // Update meta tags for SEO
    updateMetaTags(product);
  }

  // Update breadcrumbs
  function updateBreadcrumbs(category, subcategory, product) {
    const breadcrumbs = document.getElementById('breadcrumbs');
    if (!breadcrumbs) return;
    
    const categoryName = category?.name || 'Shop';
    const subcategoryName = subcategory?.name || '';
    const productName = product.name;
    
    breadcrumbs.innerHTML = `
      <a href="index.html">Home</a>
      <span> / </span>
      <a href="shop.html">Shop</a>
      ${categoryName !== 'Shop' ? `
        <span> / </span>
        <a href="category-${categoryName.toLowerCase().replace(/\s+/g, '-')}.html">${categoryName}</a>
      ` : ''}
      ${subcategoryName ? `
        <span> / </span>
        <span>${subcategoryName}</span>
      ` : ''}
      <span> / </span>
      <span>${productName}</span>
    `;
  }

  // Setup image gallery
  function setupImageGallery(product) {
    // Get all product images
    const images = [];
    
    // Add main image
    if (product.image || product.imageLarge) {
      images.push({
        src: convertImagePath(product.imageLarge || product.image),
        alt: product.alt || product.name,
        thumbnail: convertImagePath(product.imageSmall || product.image)
      });
    }
    
    // Add gallery images if available
    if (product.gallery && Array.isArray(product.gallery)) {
      product.gallery.forEach((img, index) => {
        images.push({
          src: convertImagePath(img.large || img.image || img),
          alt: img.alt || `${product.name} - Image ${index + 2}`,
          thumbnail: convertImagePath(img.small || img.thumbnail || img.image || img)
        });
      });
    }
    
    // If no images, show placeholder
    if (images.length === 0) {
      console.warn('No images found for product');
      images.push({
        src: './assets/images/placeholder.jpg',
        alt: product.name,
        thumbnail: './assets/images/placeholder.jpg'
      });
    }
    
    // Display main image (eager load - it's above the fold)
    const mainImage = document.getElementById('main-product-image');
    if (mainImage && images.length > 0) {
      mainImage.src = images[0].src;
      mainImage.alt = images[0].alt;
      mainImage.loading = 'eager'; // Main image loads immediately
      mainImage.onerror = function() {
        this.src = './assets/images/placeholder.jpg';
        this.onerror = null;
      };
    }
    
    // Display thumbnails (lazy load - they're below the fold)
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = '';
      
      images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        const imgElement = document.createElement('img');
        imgElement.src = img.thumbnail || img.src;
        imgElement.alt = img.alt;
        imgElement.loading = index < 3 ? 'eager' : 'lazy'; // First 3 thumbnails eager, rest lazy
        imgElement.onerror = function() {
          this.src = './assets/images/placeholder.jpg';
          this.onerror = null;
        };
        
        thumbnail.appendChild(imgElement);
        thumbnail.addEventListener('click', () => {
          switchImage(index, images);
        });
        
        thumbnailsContainer.appendChild(thumbnail);
      });
    }
    
    // Setup navigation buttons
    let currentImageIndex = 0;
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        switchImage(currentImageIndex, images);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        switchImage(currentImageIndex, images);
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        switchImage(currentImageIndex, images);
      } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        switchImage(currentImageIndex, images);
      }
    });
  }

  // Switch gallery image
  function switchImage(index, images) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage && images[index]) {
      // Preload next/previous images for smooth transitions
      const nextIndex = (index + 1) % images.length;
      const prevIndex = (index - 1 + images.length) % images.length;
      const preloadNext = new Image();
      preloadNext.src = images[nextIndex].src;
      const preloadPrev = new Image();
      preloadPrev.src = images[prevIndex].src;
      
      mainImage.src = images[index].src;
      mainImage.alt = images[index].alt;
    }
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  // Setup add to cart button
  function setupAddToCartButton(product) {
    const addToCartButton = document.getElementById('product-add-to-cart');
    if (!addToCartButton) return;
    
    addToCartButton.addEventListener('click', () => {
      const messageInput = document.getElementById('product-message');
      const message = messageInput ? messageInput.value.trim() : '';
      
      // Prepare product data
      const productData = {
        id: product.id || null,
        name: product.name,
        price: product.price,
        image: convertImagePath(product.image || product.imageLarge || product.imageSmall),
        alt: product.alt || product.name,
        message: message // Add custom message
      };
      
      console.log('Adding product to cart:', productData);
      
      if (window.addToCart) {
        window.addToCart(productData);
        
        // Show success message
        if (window.showSuccess) {
          window.showSuccess('Product added to cart!');
        }
        
        // Clear message input
        if (messageInput) {
          messageInput.value = '';
          updateMessageCharCount();
        }
      } else {
        // Cart system not loaded yet - wait a bit and try again
        console.warn('Cart system not loaded, waiting...');
        setTimeout(() => {
          if (window.addToCart) {
            window.addToCart(productData);
            if (window.showSuccess) {
              window.showSuccess('Product added to cart!');
            }
            // Clear message input
            if (messageInput) {
              messageInput.value = '';
              updateMessageCharCount();
            }
          } else {
            console.error('Cart system not loaded after timeout');
            if (window.showError) {
              window.showError('Cart system is not ready. Please refresh the page and try again.');
            } else {
              alert('Cart system is not ready. Please refresh the page and try again.');
            }
          }
        }, 500);
      }
    });
  }

  // Update additional info
  function updateAdditionalInfo(product, category, subcategory) {
    const additionalInfo = document.getElementById('product-additional-info');
    if (!additionalInfo) return;
    
    let infoHTML = '';
    
    if (category && category.name) {
      infoHTML += `<p><strong>Category:</strong> ${escapeHtml(category.name)}</p>`;
    }
    
    if (subcategory && subcategory.name) {
      infoHTML += `<p><strong>Type:</strong> ${escapeHtml(subcategory.name)}</p>`;
    }
    
    if (product.material) {
      infoHTML += `<p><strong>Material:</strong> ${escapeHtml(product.material)}</p>`;
    }
    
    if (product.dimensions) {
      infoHTML += `<p><strong>Dimensions:</strong> ${escapeHtml(product.dimensions)}</p>`;
    }
    
    if (product.availability) {
      infoHTML += `<p><strong>Availability:</strong> ${escapeHtml(product.availability)}</p>`;
    }
    
    additionalInfo.innerHTML = infoHTML || '<p>No additional information available.</p>';
  }

  // Update meta tags
  function updateMetaTags(product) {
    // Update description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && product.fullDescription) {
      metaDescription.content = product.fullDescription.substring(0, 160);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = `${product.name} - Elemental Fox Crafts`;
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && product.fullDescription) {
      ogDescription.content = product.fullDescription.substring(0, 160);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && product.imageLarge) {
      ogImage.content = convertImagePath(product.imageLarge);
    }
  }

  // Extract price from string
  function extractPrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    if (!priceString) return 0;
    const match = priceString.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  // Escape HTML
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
    const productTitle = document.getElementById('product-title');
    if (productTitle) {
      productTitle.textContent = 'Loading...';
    }
  }

  // Show error
  function showError(message) {
    const productTitle = document.getElementById('product-title');
    if (productTitle) {
      productTitle.textContent = 'Product Not Found';
    }
    
    const productDescription = document.getElementById('product-description');
    if (productDescription) {
      productDescription.innerHTML = `<p class="error-message">${escapeHtml(message)}</p>`;
    }
    
    if (window.showError) {
      window.showError(message);
    }
  }

  // Update message character count
  function updateMessageCharCount() {
    const messageInput = document.getElementById('product-message');
    const charCount = document.getElementById('message-char-count');
    
    if (messageInput && charCount) {
      charCount.textContent = messageInput.value.length;
    }
  }

  // Initialize when DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        loadProductDetail();
        setupMessageCounter();
      });
    } else {
      loadProductDetail();
      setupMessageCounter();
    }
  }

  // Setup message character counter
  function setupMessageCounter() {
    const messageInput = document.getElementById('product-message');
    if (messageInput) {
      // Initialize counter
      updateMessageCharCount();
      // Update on input
      messageInput.addEventListener('input', updateMessageCharCount);
    }
  }

  // Initialize
  init();
})();

