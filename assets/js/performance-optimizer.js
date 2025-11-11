/**
 * Performance Optimization Module
 * Provides utilities for optimizing website performance
 */

(function() {
  'use strict';

  // JSON data cache to avoid redundant fetches
  const jsonCache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Cached fetch for JSON files
   * Prevents redundant network requests
   */
  async function cachedFetch(url, options = {}) {
    const cacheKey = url;
    const now = Date.now();
    
    // Check cache
    if (jsonCache.has(cacheKey)) {
      const cached = jsonCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        console.log(`[Performance] Cache hit for: ${url}`);
        return cached.data;
      } else {
        // Cache expired
        jsonCache.delete(cacheKey);
      }
    }

    // Fetch and cache
    console.log(`[Performance] Fetching: ${url}`);
    try {
      const response = await (window.safeFetch ? window.safeFetch(url, options) : fetch(url));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      const data = window.safeJsonParse ? window.safeJsonParse(text, null) : JSON.parse(text);
      
      // Cache the data
      jsonCache.set(cacheKey, {
        data: data,
        timestamp: now
      });
      
      return data;
    } catch (error) {
      console.error(`[Performance] Failed to fetch ${url}:`, error);
      throw error;
    }
  }

  /**
   * Batch fetch multiple JSON files in parallel
   */
  async function batchFetch(urls, options = {}) {
    const promises = urls.map(url => cachedFetch(url, options));
    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        url: urls[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    } catch (error) {
      console.error('[Performance] Batch fetch error:', error);
      return urls.map(url => ({ url, data: null, error }));
    }
  }

  /**
   * Clear expired cache entries
   */
  function clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of jsonCache.entries()) {
      if (now - value.timestamp >= CACHE_DURATION) {
        jsonCache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  function clearCache() {
    jsonCache.clear();
    console.log('[Performance] Cache cleared');
  }

  /**
   * Get cache statistics
   */
  function getCacheStats() {
    return {
      size: jsonCache.size,
      entries: Array.from(jsonCache.keys())
    };
  }

  /**
   * Lazy load images using Intersection Observer
   */
  function initLazyLoading() {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.loading = 'lazy';
      });
      return;
    }

    // Fallback: Use Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // No support, load all images immediately
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
      });
      return;
    }

    // Use Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before image enters viewport
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /**
   * Debounce function
   */
  function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Preload critical resources
   */
  function preloadResource(href, as, type = null) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }

  /**
   * Prefetch resources for future navigation
   */
  function prefetchResource(href, as = 'document') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }

  /**
   * Optimize images - add lazy loading attributes
   */
  function optimizeImages() {
    // Add loading="lazy" to images below the fold
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
      // Skip first few images (above the fold)
      if (index > 2) {
        img.loading = 'lazy';
      }
    });
  }

  /**
   * Reduce layout shifts by setting image dimensions
   */
  function setImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      if (img.complete && img.naturalWidth && img.naturalHeight) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      } else {
        img.addEventListener('load', function() {
          if (this.naturalWidth && this.naturalHeight) {
            this.width = this.naturalWidth;
            this.height = this.naturalHeight;
          }
        }, { once: true });
      }
    });
  }

  /**
   * Initialize performance optimizations
   */
  function init() {
    // Initialize lazy loading
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initLazyLoading();
        optimizeImages();
        setImageDimensions();
      });
    } else {
      initLazyLoading();
      optimizeImages();
      setImageDimensions();
    }

    // Clear expired cache periodically
    setInterval(clearExpiredCache, CACHE_DURATION);

    // Prefetch likely next pages
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
      prefetchResource('shop.html');
    }
  }

  // Expose to global scope
  window.PerformanceOptimizer = {
    cachedFetch: cachedFetch,
    batchFetch: batchFetch,
    clearCache: clearCache,
    getCacheStats: getCacheStats,
    debounce: debounce,
    throttle: throttle,
    preloadResource: preloadResource,
    prefetchResource: prefetchResource,
    initLazyLoading: initLazyLoading
  };

  // Also expose commonly used functions directly
  window.cachedFetch = cachedFetch;
  window.batchFetch = batchFetch;
  window.debounce = debounce;
  window.throttle = throttle;

  // Initialize on load
  init();

})();

