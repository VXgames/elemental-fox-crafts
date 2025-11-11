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
  function showToast(message, type = 'info', duration = 5000, options = {}) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const messageText = document.createElement('span');
    messageText.className = 'toast-message';
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
    
    // Add recovery suggestions if provided
    if (options.recoverySuggestions && options.recoverySuggestions.length > 0) {
      const recoveryDiv = document.createElement('div');
      recoveryDiv.className = 'toast-recovery';
      const recoveryTitle = document.createElement('strong');
      recoveryTitle.textContent = 'Suggestions: ';
      recoveryDiv.appendChild(recoveryTitle);
      
      const recoveryList = document.createElement('ul');
      recoveryList.className = 'toast-recovery-list';
      options.recoverySuggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        recoveryList.appendChild(li);
      });
      recoveryDiv.appendChild(recoveryList);
      toast.appendChild(recoveryDiv);
    }
    
    // Add retry button if provided
    if (options.retry && typeof options.retry === 'function') {
      const retryBtn = document.createElement('button');
      retryBtn.className = 'toast-retry';
      retryBtn.textContent = 'Retry';
      retryBtn.setAttribute('aria-label', 'Retry operation');
      retryBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toast.classList.add('toast-retrying');
        retryBtn.disabled = true;
        retryBtn.textContent = 'Retrying...';
        
        try {
          const result = options.retry();
          if (result && typeof result.then === 'function') {
            // Handle promise
            result
              .then(() => {
                toast.remove();
                if (window.showSuccess) {
                  window.showSuccess('Operation completed successfully');
                }
              })
              .catch((error) => {
                toast.classList.remove('toast-retrying');
                retryBtn.disabled = false;
                retryBtn.textContent = 'Retry';
                if (window.showError) {
                  window.showError('Retry failed. Please try again.');
                }
              });
          } else {
            // Synchronous retry
            toast.remove();
            if (window.showSuccess) {
              window.showSuccess('Operation completed successfully');
            }
          }
        } catch (error) {
          toast.classList.remove('toast-retrying');
          retryBtn.disabled = false;
          retryBtn.textContent = 'Retry';
          if (window.showError) {
            window.showError('Retry failed. Please try again.');
          }
        }
      });
      toast.appendChild(retryBtn);
    }
    
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

  // Show error with recovery suggestions and retry option
  function showErrorWithRecovery(message, recoverySuggestions = [], options = {}) {
    return showToast(message, 'error', options.duration || 10000, {
      recoverySuggestions: recoverySuggestions,
      retry: options.retry
    });
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
  window.showErrorWithRecovery = showErrorWithRecovery;
})();

