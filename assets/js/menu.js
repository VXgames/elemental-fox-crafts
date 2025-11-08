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

  // Close on resize to avoid stuck open state
  window.addEventListener('resize', function(){
    closeAll();
    if(window.innerWidth > 768) {
      isMenuOpen = false;
      mobileMenuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  // Mobile menu toggle
  if(mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Note: Mobile touch handling is now done in the main click handler above
  // This duplicate handler has been removed to prevent conflicts

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
})();
