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

    // Click toggles the menu on touch/click
    trigger.addEventListener('click', function(ev){
      // If device supports hover and pointer fine, allow default hover behaviour; otherwise toggle
      const mq = window.matchMedia('(hover: none), (pointer: coarse)');
      if(mq.matches){
        ev.preventDefault();
        toggleItem(item);
      }
      // otherwise allow normal link navigation if user actually clicks and CSS hover handles dropdown
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

  // Handle touch events for mobile mega menu
  const mq = window.matchMedia('(hover: none), (pointer: coarse)');
  if(mq.matches) {
    navMegaItems.forEach(item => {
      const trigger = item.querySelector('a');
      if(trigger) {
        trigger.addEventListener('click', function(ev) {
          ev.preventDefault();
          item.classList.toggle('open');
          const isOpen = item.classList.contains('open');
          trigger.setAttribute('aria-expanded', isOpen);
          closeAll(isOpen ? item : null);
        });
      }
    });
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
})();
