/**
 * Toast Notification System
 * Provides user-friendly error, success, and info messages
 */

(function() {
  'use strict';

  // Create toast container if it doesn't exist
  function getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  // Show toast notification
  function showToast(message, type = 'info', duration = 5000) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const messageText = document.createElement('span');
    messageText.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.addEventListener('click', function() {
      toast.remove();
    });
    
    toast.appendChild(messageText);
    toast.appendChild(closeBtn);
    container.appendChild(toast);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(function() {
        if (toast.parentNode) {
          toast.style.animation = 'slideIn 0.3s ease reverse';
          setTimeout(function() {
            toast.remove();
          }, 300);
        }
      }, duration);
    }
    
    return toast;
  }

  // Expose to global scope
  window.showToast = showToast;
  window.showError = function(message, duration) {
    return showToast(message, 'error', duration || 7000);
  };
  window.showSuccess = function(message, duration) {
    return showToast(message, 'success', duration || 5000);
  };
  window.showInfo = function(message, duration) {
    return showToast(message, 'info', duration || 5000);
  };
})();

