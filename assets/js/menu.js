// Enhanced menu helper: enables click-to-toggle for mega menus (touch devices), keyboard navigation, and aria-expanded sync
(function(){
  'use strict';
  const navMegaItems = document.querySelectorAll('.nav-item.nav-mega');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  let isMenuOpen = false;

  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenuToggle.classList.toggle('open', isMenuOpen);
    navLinks.classList.toggle('open', isMenuOpen);
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
  }

  function closeAll(except){
    navMegaItems.forEach(item => {
      if(item === except) return;
      item.classList.remove('open');
      const trigger = item.querySelector('a');
      if(trigger) trigger.setAttribute('aria-expanded','false');
      const menu = item.querySelector('.mega-dropdown');
      if(menu) menu.style.display = '';
    });
  }

  function toggleItem(item){
    const isOpen = item.classList.toggle('open');
    const trigger = item.querySelector('a');
    if(trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const menu = item.querySelector('.mega-dropdown');
    if(menu){
      // inline style to ensure immediate visibility change on touch devices
      menu.style.display = isOpen ? 'flex' : '';
      // If opening, focus the first link in the menu
      if(isOpen){
        const firstLink = menu.querySelector('a');
        if(firstLink) setTimeout(() => firstLink.focus(), 100);
      }
    }
    if(isOpen) closeAll(item);
  }

  function handleArrowNavigation(currentElement, key){
    const menu = currentElement.closest('.mega-dropdown');
    if(!menu) return;

    const links = Array.from(menu.querySelectorAll('a'));
    const currentIndex = links.indexOf(currentElement);
    let nextIndex;

    switch(key){
      case 'ArrowRight':
        // Move right in preview cards or to next category
        nextIndex = currentIndex + 1;
        if(nextIndex >= links.length) nextIndex = 0;
        break;
      case 'ArrowLeft':
        // Move left in preview cards or to previous category
        nextIndex = currentIndex - 1;
        if(nextIndex < 0) nextIndex = links.length - 1;
        break;
      case 'ArrowDown':
        // Move to next row or wrap to top
        nextIndex = currentIndex + 3; // Assuming 3 items per row
        if(nextIndex >= links.length) nextIndex = currentIndex % 3;
        break;
      case 'ArrowUp':
        // Move to previous row or wrap to bottom
        nextIndex = currentIndex - 3; // Assuming 3 items per row
        if(nextIndex < 0){
          const lastRowStart = Math.floor((links.length - 1) / 3) * 3;
          nextIndex = Math.min(lastRowStart + (currentIndex % 3), links.length - 1);
        }
        break;
      default:
        return;
    }

    if(nextIndex >= 0 && nextIndex < links.length){
      links[nextIndex].focus();
    }
  }

  // Initialize aria-expanded, click handlers, and keyboard navigation
  navMegaItems.forEach(item => {
    const trigger = item.querySelector('a');
    const menu = item.querySelector('.mega-dropdown');
    if(trigger) trigger.setAttribute('aria-expanded','false');

    // On mobile, allow navigation to shop.html; on desktop, allow hover behavior
    trigger.addEventListener('click', function(ev){
      const mq = window.matchMedia('(hover: none), (pointer: coarse)');
      if(mq.matches){
        // On mobile/touch devices, allow navigation to shop.html
        // Don't prevent default - let the link work normally
        // If user wants to expand menu, they can use a separate control or we can add one
        closeAll();
        return;
      }
      // On desktop with hover, allow normal link navigation and CSS hover handles dropdown
    });

    // Keyboard navigation within mega menu
    item.addEventListener('keydown', function(ev){
      if(ev.key === 'Escape' || ev.key === 'Esc'){
        item.classList.remove('open');
        if(trigger) trigger.setAttribute('aria-expanded','false');
        if(menu) menu.style.display = '';
        trigger.focus();
      } else if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)){
        if(item.classList.contains('open')){
          ev.preventDefault();
          handleArrowNavigation(ev.target, ev.key);
        }
      } else if(ev.key === 'Enter' || ev.key === ' '){
        // Space or Enter on nav item toggles menu
        if(ev.target === trigger){
          ev.preventDefault();
          toggleItem(item);
        }
      }
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', function(ev){
    if(!ev.target.closest('.nav-item.nav-mega')){
      closeAll();
    }
  });

  // Close on resize to avoid stuck open state (with debouncing for performance)
  let resizeTimeout;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      closeAll();
      if(window.innerWidth > 768) {
        isMenuOpen = false;
        mobileMenuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    }, 250);
  }, { passive: true });

  // Mobile menu toggle
  if(mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu, { passive: false });
  }

  // Close menu when clicking outside on mobile
  document.addEventListener('click', function(ev) {
    if(isMenuOpen && !ev.target.closest('.navbar')) {
      toggleMobileMenu();
    }
  });

  // Initialize ARIA attributes
  if(mobileMenuToggle) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  // Desktop hover behavior for mega dropdown - ensures menu stays open when navigating
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const header = document.querySelector('header');
    const allNavItems = document.querySelectorAll('.nav-item');
    
    navMegaItems.forEach(item => {
      const menu = item.querySelector('.mega-dropdown');
      if(!menu) return;
      
      let closeTimeout = null;
      const closeDelay = 2000; // 2 seconds
      let isMenuHovered = false;
      let isItemHovered = false;
      
      function openMenu() {
        // Cancel any pending close
        if(closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        // Add class to indicate JS is controlling this menu
        menu.classList.add('js-controlled');
        // Force menu to be visible and interactive - use inline styles to override CSS
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.pointerEvents = 'auto';
        menu.style.transition = 'opacity 0.15s ease 0s, visibility 0.15s ease 0s';
      }
      
      function closeMenu() {
        // Clear any pending timeout
        if(closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        // Force close by setting hidden state
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.pointerEvents = 'none';
        menu.style.transition = 'opacity 0.2s ease 0s, visibility 0.2s ease 0s';
        
        // After transition completes, remove inline styles and class
        setTimeout(() => {
          // Only clear if menu is still supposed to be closed (not hovered)
          if(!isItemHovered && !isMenuHovered) {
            menu.style.opacity = '';
            menu.style.visibility = '';
            menu.style.pointerEvents = '';
            menu.style.transition = '';
            menu.classList.remove('js-controlled');
          }
        }, 200);
      }
      
      function scheduleClose() {
        // Don't schedule if either item or menu is still hovered
        if(isItemHovered || isMenuHovered) {
          return;
        }
        // Clear any existing timeout
        if(closeTimeout) {
          clearTimeout(closeTimeout);
        }
        // Schedule close after delay
        closeTimeout = setTimeout(() => {
          // Double-check we're still supposed to close
          if(!isItemHovered && !isMenuHovered) {
            closeMenu();
          }
          closeTimeout = null;
        }, closeDelay);
      }
      
      // Track hover state for nav item
      item.addEventListener('mouseenter', function() {
        // Close all other menus first
        navMegaItems.forEach(otherItem => {
          if(otherItem !== item) {
            const otherMenu = otherItem.querySelector('.mega-dropdown');
            if(otherMenu) {
              otherMenu.style.opacity = '0';
              otherMenu.style.visibility = 'hidden';
              otherMenu.style.pointerEvents = 'none';
              otherMenu.style.transition = '';
              otherMenu.classList.remove('js-controlled');
            }
          }
        });
        isItemHovered = true;
        openMenu();
      });
      
      item.addEventListener('mouseleave', function(e) {
        // Check if we're moving to another nav item
        const relatedTarget = e.relatedTarget;
        if(relatedTarget && relatedTarget.closest('.nav-item')) {
          // Moving to another nav item - close immediately
          closeMenu();
          isItemHovered = false;
          isMenuHovered = false;
          return;
        }
        isItemHovered = false;
        scheduleClose();
      });
      
      // Track hover state for menu
      menu.addEventListener('mouseenter', function() {
        isMenuHovered = true;
        openMenu();
      });
      
      menu.addEventListener('mouseleave', function(e) {
        const relatedTarget = e.relatedTarget;
        // If moving to another nav item or leaving header, close immediately
        if(relatedTarget) {
          if(relatedTarget.closest('.nav-item') || 
             (header && !header.contains(relatedTarget))) {
            closeMenu();
            isItemHovered = false;
            isMenuHovered = false;
            return;
          }
        }
        isMenuHovered = false;
        scheduleClose();
      });
    });
    
    // Close menu when mouse leaves header area entirely
    if(header) {
      header.addEventListener('mouseleave', function(e) {
        const relatedTarget = e.relatedTarget;
        // If leaving header and not moving to another element in header
        if(!relatedTarget || !header.contains(relatedTarget)) {
          navMegaItems.forEach(item => {
            const menu = item.querySelector('.mega-dropdown');
            if(menu) {
              menu.style.opacity = '0';
              menu.style.visibility = 'hidden';
              menu.style.pointerEvents = 'none';
              menu.style.transition = '';
              menu.classList.remove('js-controlled');
            }
          });
        }
      });
    }
    
    // Close menu when hovering over non-mega nav items
    allNavItems.forEach(navItem => {
      if(!navItem.classList.contains('nav-mega')) {
        navItem.addEventListener('mouseenter', function() {
          // Close all mega menus when hovering other nav items
          navMegaItems.forEach(item => {
            const menu = item.querySelector('.mega-dropdown');
            if(menu) {
              menu.style.opacity = '0';
              menu.style.visibility = 'hidden';
              menu.style.pointerEvents = 'none';
              menu.style.transition = '';
              menu.classList.remove('js-controlled');
            }
          });
        });
      }
    });
  }

  // Build Cart and Wishlist mobile items (no cloning, static, reliable)
  function cloneMobileMenuItems() {
    try {
      const navLinksEl = document.querySelector('.nav-links');
      if (!navLinksEl) {
        console.warn('[mobile-menu] .nav-links not found');
        return;
      }

      console.log('[mobile-menu] Injecting cart/wishlist buttons...');

      const heartSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      const cartSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true" focusable="false"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';

      function makeItem(className, label, svgMarkup, onActivate, options) {
        const opts = options || {};
        const li = document.createElement('li');
        li.className = 'nav-item ' + className + ' mobile-only';
        
        // Create wrapper div to match CSS expectations
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;align-items:center;gap:0.75rem;width:100%;cursor:pointer;';
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('tabindex', '0');
        wrapper.setAttribute('aria-label', label);
        
        wrapper.innerHTML = svgMarkup + '<span style="text-transform:uppercase;letter-spacing:.05em;font-weight:500;font-size:.95rem;">' + label + '</span>';

        wrapper.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          console.log('[mobile-menu] ' + label + ' clicked');
          // close menu immediately
          if (mobileMenuToggle && navLinks) {
            isMenuOpen = false;
            mobileMenuToggle.classList.remove('open');
            navLinks.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
          }
          // navigate/open on next frame to avoid double-activation
          requestAnimationFrame(() => { onActivate(); });
        });
        
        // Add keyboard support
        wrapper.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            wrapper.click();
          }
        });

        li.appendChild(wrapper);
        return li;
      }

      // Check and add wishlist button
      let wishlistItem = document.querySelector('.mobile-wishlist-item');
      if (!wishlistItem) {
        console.log('[mobile-menu] Adding wishlist button');
        const wish = makeItem('mobile-wishlist-item', 'Wishlist', heartSvg, () => {
          window.location.assign('wishlist.html');
        }, { tag: 'a', href: 'wishlist.html' });
        navLinksEl.appendChild(wish);
      } else {
        console.log('[mobile-menu] Wishlist button already exists');
      }

      // Check and add cart button
      let cartItem = document.querySelector('.mobile-cart-item');
      if (!cartItem) {
        console.log('[mobile-menu] Adding cart button');
        const cart = makeItem('mobile-cart-item', 'Cart', cartSvg, () => {
          if (window.cartAPI && typeof window.cartAPI.openCart === 'function') {
            try { window.cartAPI.openCart(); return; } catch(_e) {}
          }
          const cartToggle = document.querySelector('.cart-toggle');
          if (cartToggle) cartToggle.click();
        });
        navLinksEl.appendChild(cart);
      } else {
        console.log('[mobile-menu] Cart button already exists');
      }

      console.log('[mobile-menu] Button injection complete. Wishlist exists:', !!document.querySelector('.mobile-wishlist-item'), 'Cart exists:', !!document.querySelector('.mobile-cart-item'));
    } catch (err) {
      console.error('[mobile-menu] clone error:', err);
    }
  }

  // Call cloning function when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cloneMobileMenuItems);
  } else {
    // DOM is already loaded
    cloneMobileMenuItems();
  }
  
  // Re-run after page show (handles back/forward navigation)
  window.addEventListener('pageshow', function(event) {
    // Run on every page show, including cached pages
    cloneMobileMenuItems();
  });
  
  // Also run periodically for first few seconds to ensure items are always present
  setTimeout(cloneMobileMenuItems, 100);
  setTimeout(cloneMobileMenuItems, 500);
  setTimeout(cloneMobileMenuItems, 1000);
  // Enforce hiding desktop header block on mobile (with fallback selectors)
  function enforceMobileHeaderHidden() {
    try {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      
      // Target all possible desktop elements
      const desktopSelectors = [
        '.header-desktop-only',
        '.desktop-only',
        'header .header-desktop-only',
        'header .desktop-only',
        'header .wishlist-toggle',
        'header .cart-toggle',
        'header .header-search-container',
        'header .header-instagram-icon'
      ];

      function applyHardHide(el) {
        if (!el) return;
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('inert', '');
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.style.setProperty('position', 'absolute', 'important');
        el.style.setProperty('left', '-99999px', 'important');
        el.style.setProperty('top', '-99999px', 'important');
        el.style.setProperty('width', '0', 'important');
        el.style.setProperty('height', '0', 'important');
        el.style.setProperty('overflow', 'hidden', 'important');
        el.style.setProperty('clip', 'rect(0, 0, 0, 0)', 'important');
        el.style.setProperty('clip-path', 'inset(50%)', 'important');
      }

      function clearHardHide(el) {
        if (!el) return;
        el.removeAttribute('aria-hidden');
        el.removeAttribute('inert');
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
        el.style.removeProperty('pointer-events');
        el.style.removeProperty('position');
        el.style.removeProperty('left');
        el.style.removeProperty('top');
        el.style.removeProperty('width');
        el.style.removeProperty('height');
        el.style.removeProperty('overflow');
        el.style.removeProperty('clip');
        el.style.removeProperty('clip-path');
      }

      if (isMobile) {
        // Apply hiding to all desktop elements
        desktopSelectors.forEach(sel => {
          const elements = document.querySelectorAll(sel);
          elements.forEach(el => applyHardHide(el));
        });
      } else {
        // Clear hiding on desktop
        desktopSelectors.forEach(sel => {
          const elements = document.querySelectorAll(sel);
          elements.forEach(el => clearHardHide(el));
        });
      }
    } catch (err) {
      console.warn('[mobile-menu] enforceMobileHeaderHidden failed', err);
    }
  }

  // Run enforcement on ready and resize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceMobileHeaderHidden);
  } else {
    enforceMobileHeaderHidden();
  }
  
  // Run on every resize with debouncing
  window.addEventListener('resize', (function(){
    let t; return function(){
      clearTimeout(t); t = setTimeout(enforceMobileHeaderHidden, 150);
    };
  })());
  
  // Run on page show (for back/forward navigation)
  window.addEventListener('pageshow', enforceMobileHeaderHidden);
  
  // Run periodically for the first few seconds (to catch any late-loading issues)
  const intervals = [100, 250, 500, 1000, 2000];
  intervals.forEach(delay => {
    setTimeout(enforceMobileHeaderHidden, delay);
  });

})();
