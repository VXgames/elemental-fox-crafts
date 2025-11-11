/**
 * Checkout Page Handler
 * Handles order display, form submission, and email notifications
 */

(function() {
  'use strict';

  // Load cart data from sessionStorage
  function loadCheckoutData() {
    try {
      const cartData = sessionStorage.getItem('checkout_cart');
      if (!cartData) {
        // No cart data, redirect to shop
        showEmptyCart();
        return null;
      }
      
      // Use safe JSON parse if available
      const parsed = window.safeJsonParse ? window.safeJsonParse(cartData, null) : JSON.parse(cartData);
      if (!parsed) {
        throw new Error('Failed to parse cart data');
      }
      
      return parsed;
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'checkout_load_data', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH,
          customMessage: 'Unable to load checkout data. Please return to your cart and try again.'
        });
      } else {
        console.error('Error loading checkout data:', error);
      }
      showEmptyCart();
      return null;
    }
  }

  // Show empty cart message
  function showEmptyCart() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutEmpty = document.getElementById('checkout-empty');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutEmpty) {
      checkoutEmpty.style.display = 'block';
    }
    if (checkoutItems) {
      checkoutItems.innerHTML = '';
    }
    if (checkoutForm) {
      checkoutForm.style.display = 'none';
    }
  }

  // Display order items
  function displayOrderItems(cartData) {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutEmpty = document.getElementById('checkout-empty');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutShipping = document.getElementById('checkout-shipping');
    
    if (!checkoutItems || !cartData || !cartData.items || cartData.items.length === 0) {
      showEmptyCart();
      return;
    }

    // Hide empty message
    if (checkoutEmpty) {
      checkoutEmpty.style.display = 'none';
    }

    // Clear and populate items
    checkoutItems.innerHTML = '';
    cartData.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'checkout-item';
      itemElement.innerHTML = `
        <div class="checkout-item-image">
          <img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.name)}" onerror="this.onerror=null; this.style.display='none';">
        </div>
        <div class="checkout-item-details">
          <h4>${escapeHtml(item.name)}</h4>
          <p>Quantity: ${item.quantity}</p>
          ${item.message ? `<p class="checkout-item-message"><strong>Note:</strong> ${escapeHtml(item.message)}</p>` : ''}
          <p class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
      checkoutItems.appendChild(itemElement);
    });

    // Get shipping cost from cartData (set in cart page)
    const shipping = cartData.shipping || 0;
    const subtotal = cartData.total || 0;
    const total = subtotal + shipping;

    // Update totals
    if (checkoutSubtotal) {
      checkoutSubtotal.textContent = formatPrice(subtotal);
    }
    if (checkoutShipping) {
      checkoutShipping.textContent = formatPrice(shipping);
    }
    if (checkoutTotal) {
      checkoutTotal.textContent = formatPrice(total);
    }
  }

  // Format price
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  // Send order email
  async function sendOrderEmail(formData, cartData) {
    try {
      // Check if EmailJS is configured
      if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded. Order will be processed but email notification will not be sent.');
        // Return success anyway - we'll handle email separately
        // In production, you might want to store orders in a database
        return { success: true, emailSent: false, error: 'Email service not configured' };
      }

      // Check if EmailJS is initialized with a valid key
      const emailjsConfig = emailjs.init;
      if (!emailjsConfig || emailjsConfig.toString().includes('YOUR_PUBLIC_KEY')) {
        console.warn('EmailJS not properly configured. Please update checkout.html with your EmailJS Public Key.');
        return { success: true, emailSent: false, error: 'EmailJS not configured' };
      }

      // Build order items list with messages
      let orderItemsList = '';
      if (cartData.items && cartData.items.length > 0) {
        cartData.items.forEach((item, index) => {
          orderItemsList += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}`;
          if (item.message && item.message.trim()) {
            orderItemsList += `\n   Special Request/Message: ${item.message}`;
          }
          orderItemsList += '\n';
        });
      }

      // Prepare email template parameters
      const emailParams = {
        to_email: 'YOUR_EMAIL@example.com', // Replace with your email
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        customer_address: formData.customerAddress,
        customer_city: formData.customerCity,
        customer_state: formData.customerState,
        customer_zip: formData.customerZip,
        customer_country: formData.customerCountry,
        customer_notes: formData.customerNotes || 'None',
        order_items: orderItemsList || 'No items',
        order_subtotal: formatPrice(cartData.total),
        order_shipping: formatPrice(cartData.shipping || 0),
        order_total: formatPrice((cartData.total || 0) + (cartData.shipping || 0)),
        payment_method: formData.paymentMethod || 'Not specified',
        order_date: new Date().toLocaleString()
      };

      // Check if Service ID and Template ID are configured
      const serviceId = 'YOUR_SERVICE_ID';
      const templateId = 'YOUR_TEMPLATE_ID';
      
      if (serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID') {
        console.warn('EmailJS Service ID or Template ID not configured. Please update checkout.js');
        return { success: true, emailSent: false, error: 'EmailJS Service/Template ID not configured' };
      }

      // Send email using EmailJS
      const response = await emailjs.send(serviceId, templateId, emailParams);

      console.log('Email sent successfully:', response);
      return { success: true, emailSent: true, response: response };
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'checkout_send_email', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
          customMessage: 'Unable to send order confirmation email. Your order has been received, but you may not receive a confirmation email. Please contact us if you have any questions.'
        });
      } else {
        console.error('Error sending email:', error);
      }
      return { success: false, error: error.message };
    }
  }

  // Initialize Stripe (if available)
  let stripe = null;
  let cardElement = null;
  
  function initStripe() {
    // Check if Stripe is available
    if (typeof Stripe === 'undefined') {
      console.warn('Stripe.js not loaded. Card payments will not be available.');
      return;
    }
    
    // Initialize Stripe with your publishable key
    // Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual Stripe publishable key
    const stripeKey = 'YOUR_STRIPE_PUBLISHABLE_KEY';
    if (stripeKey === 'YOUR_STRIPE_PUBLISHABLE_KEY') {
      console.warn('Stripe publishable key not configured. Card payments will not work.');
      return;
    }
    
    try {
      stripe = Stripe(stripeKey);
      const elements = stripe.elements();
      
      // Create card element
      cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#E8E6DF',
            '::placeholder': {
              color: '#BCB893',
            },
          },
          invalid: {
            color: '#d32f2f',
          },
        },
      });
      
      // Mount card element
      const cardElementContainer = document.getElementById('card-element');
      if (cardElementContainer) {
        cardElement.mount('#card-element');
        
        // Handle real-time validation errors
        cardElement.on('change', function(event) {
          const displayError = document.getElementById('card-errors');
          if (event.error) {
            if (displayError) {
              displayError.textContent = event.error.message;
            }
          } else {
            if (displayError) {
              displayError.textContent = '';
            }
          }
        });
      }
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }

  // Handle payment method selection
  function setupPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('card-payment-details');
    const paypalDetails = document.getElementById('paypal-payment-details');
    const otherDetails = document.getElementById('other-payment-details');
    
    paymentMethods.forEach(method => {
      method.addEventListener('change', function() {
        // Hide all payment details
        if (cardDetails) cardDetails.classList.remove('active');
        if (paypalDetails) paypalDetails.classList.remove('active');
        if (otherDetails) otherDetails.classList.remove('active');
        
        // Show selected payment details
        if (this.value === 'card' && cardDetails) {
          cardDetails.classList.add('active');
        } else if (this.value === 'paypal' && paypalDetails) {
          paypalDetails.classList.add('active');
        } else if (this.value === 'other' && otherDetails) {
          otherDetails.classList.add('active');
        }
      });
    });
  }

  // Process payment
  async function processPayment(paymentMethod, cartData, formData) {
    if (paymentMethod === 'card') {
      // Process card payment with Stripe
      if (!stripe || !cardElement) {
        const errorMsg = 'Card payment is not available. Please select another payment method or contact us.';
        if (window.showError) {
          window.showError(errorMsg);
        } else {
          alert(errorMsg);
        }
        return { success: false, error: 'Stripe not initialized' };
      }
      
      try {
        // Create payment intent on your server (you'll need a backend for this)
        // For now, we'll just validate the card and send order email
        const { error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
        
        if (error) {
          return { success: false, error: error.message };
        }
        
        // In production, you would:
        // 1. Send payment method to your server
        // 2. Create a payment intent
        // 3. Confirm the payment
        // For now, we'll just return success (you'll need to implement backend)
        return { success: true, paymentMethod: 'card' };
      } catch (error) {
        if (window.ErrorHandler) {
          window.ErrorHandler.handle(error, 'checkout_payment', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.HIGH,
            customMessage: 'Payment processing failed. Please try again or select a different payment method.'
          });
        } else {
          console.error('Payment error:', error);
        }
        return { success: false, error: error.message };
      }
    } else if (paymentMethod === 'paypal') {
      // PayPal processing would go here
      // For now, just return success
      return { success: true, paymentMethod: 'paypal' };
    } else {
      // Other payment method - no processing needed
      return { success: true, paymentMethod: 'other' };
    }
  }

  // Handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
      const cartData = loadCheckoutData();
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        const errorMsg = 'Your cart is empty. Please add items before checking out.';
        if (window.showInfo) {
          window.showInfo(errorMsg);
        } else {
          alert(errorMsg);
        }
        window.location.href = 'shop.html';
        return;
      }

      // Get form data with safe access and sanitization
      const getFormValue = (id) => {
        const element = document.getElementById(id);
        const value = element?.value?.trim() || '';
        // Sanitize input using Security module if available
        if (window.Security && window.Security.sanitizeInput) {
          return window.Security.sanitizeInput(value);
        }
        return value;
      };
      
      const formData = {
        customerName: getFormValue('customer-name'),
        customerEmail: getFormValue('customer-email'),
        customerPhone: getFormValue('customer-phone'),
        customerAddress: getFormValue('customer-address'),
        customerCity: getFormValue('customer-city'),
        customerState: getFormValue('customer-state'),
        customerZip: getFormValue('customer-zip'),
        customerCountry: getFormValue('customer-country'),
        customerNotes: getFormValue('customer-notes'),
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'other'
      };

      // Validate form data using error handler if available
      if (window.ErrorHandler) {
        // Validate required fields
        const requiredFields = ['customerName', 'customerEmail', 'customerAddress', 'customerCity', 'customerZip', 'customerCountry'];
        if (!window.ErrorHandler.validateRequired(formData, requiredFields, 'checkout_form')) {
          return; // Validation failed, error already shown
        }

        // Validate email format
        if (!window.ErrorHandler.validateEmail(formData.customerEmail)) {
          window.ErrorHandler.handle(new Error('Invalid email format'), 'checkout_form', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.MEDIUM,
            customMessage: 'Please enter a valid email address.'
          });
          return;
        }
      } else {
        // Fallback validation
        if (!formData.customerName || !formData.customerEmail || !formData.customerAddress) {
          const errorMsg = 'Please fill in all required fields.';
          if (window.showError) {
            window.showError(errorMsg);
          } else {
            alert(errorMsg);
          }
          return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.customerEmail)) {
          const errorMsg = 'Please enter a valid email address.';
          if (window.showError) {
            window.showError(errorMsg);
          } else {
            alert(errorMsg);
          }
          return;
        }
      }

      // Get selected payment method
      const paymentMethod = formData.paymentMethod;

    // Disable submit button and show loading state
    const submitBtn = document.querySelector('.checkout-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('button-loading');
      submitBtn.textContent = 'Processing...';
    }

    // Process payment first
    processPayment(paymentMethod, cartData, formData)
      .then(paymentResult => {
        if (!paymentResult.success) {
          const errorMsg = 'Payment error: ' + paymentResult.error;
          if (window.showError) {
            window.showError(errorMsg);
          } else {
            alert(errorMsg);
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('button-loading');
            submitBtn.textContent = 'Complete Order';
          }
          return;
        }
        
        // Send email
        return sendOrderEmail(formData, cartData);
      })
      .then(result => {
        // Prepare order confirmation data
        const orderConfirmation = {
          orderNumber: 'EFC-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          orderDate: new Date().toLocaleString(),
          items: cartData.items,
          subtotal: cartData.total,
          shipping: cartData.shipping || 0,
          total: (cartData.total || 0) + (cartData.shipping || 0),
          shippingAddress: {
            name: formData.customerName,
            address: formData.customerAddress,
            city: formData.customerCity,
            state: formData.customerState,
            zip: formData.customerZip,
            country: formData.customerCountry
          },
          paymentMethod: paymentMethod,
          emailSent: result.emailSent !== false
        };

        // Save order confirmation data
        sessionStorage.setItem('order_confirmation', JSON.stringify(orderConfirmation));
        
        // Register background sync if offline
        if (!navigator.onLine && window.PWA && window.PWA.registerBackgroundSync) {
          window.PWA.registerBackgroundSync('sync-order', orderConfirmation);
        }

        // Clear cart regardless of email result
        try {
          if (window.cartAPI && window.cartAPI.clearCart) {
            window.cartAPI.clearCart();
          }
          if (window.safeStorage) {
            window.safeStorage.remove('checkout_cart');
          } else {
            sessionStorage.removeItem('checkout_cart');
          }
        } catch (clearError) {
          // Non-critical error, just log it
          if (window.ErrorHandler) {
            window.ErrorHandler.handle(clearError, 'checkout_clear_cart', {
              showToUser: false,
              severity: window.ErrorHandler.ERROR_SEVERITY.LOW,
              silent: true
            });
          } else {
            console.warn('Failed to clear cart:', clearError);
          }
        }
        
        // Reset rate limiter on successful submission
        const form = event.target;
        if (form && form._rateLimiter && form._rateLimiter.reset) {
          form._rateLimiter.reset();
        }
        
        // Show success message
        if (result.success) {
          if (result.emailSent !== false) {
            // Email was sent successfully
            if (window.showSuccess) {
              window.showSuccess('Order placed successfully! Redirecting to confirmation...', 2000);
            }
          } else {
            // Order processed but email not sent (EmailJS not configured)
            console.warn('Order processed but email not sent:', result.error);
            if (window.showInfo) {
              window.showInfo('Order received! Email confirmation will be sent separately.', 2000);
            }
          }
        } else {
          // Order processed but email failed
          console.error('Email sending failed:', result.error);
          if (window.showInfo) {
            window.showInfo('Order received! We will contact you directly.', 2000);
          }
        }
        
        // Redirect to order confirmation page
        setTimeout(function() {
          window.location.href = 'order-confirmation.html';
        }, 1000);
      })
      .catch(error => {
        if (window.ErrorHandler) {
          window.ErrorHandler.handle(error, 'checkout_submit', {
            showToUser: true,
            severity: window.ErrorHandler.ERROR_SEVERITY.HIGH,
            customMessage: 'There was an error processing your order. Please try again or contact us directly.'
          });
        } else {
          console.error('Error processing order:', error);
          const errorMsg = 'There was an error processing your order. Please try again or contact us directly.';
          if (window.showError) {
            window.showError(errorMsg);
          } else {
            alert(errorMsg);
          }
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('button-loading');
          submitBtn.textContent = 'Complete Order';
        }
      });
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'checkout_form_submit', {
          showToUser: true,
          severity: window.ErrorHandler.ERROR_SEVERITY.HIGH
        });
      } else {
        console.error('Error in form submission:', error);
        if (window.showError) {
          window.showError('An error occurred. Please try again.');
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  }

  // Initialize checkout page
  function initCheckout() {
    const cartData = loadCheckoutData();
    
    if (cartData && cartData.items && cartData.items.length > 0) {
      displayOrderItems(cartData);
    } else {
      showEmptyCart();
    }

    // Initialize Stripe
    initStripe();
    
    // Setup payment method selection
    setupPaymentMethodSelection();

    // Attach form submit handler
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      // Initialize FormValidator if available and not already initialized
      // Note: FormValidator auto-initializes forms with data-validate attribute,
      // but we want to ensure it's initialized with our specific options
      if (window.FormValidator && !checkoutForm._validator) {
        checkoutForm._validator = new window.FormValidator(checkoutForm, {
          realTime: true,
          validateOnBlur: true,
          showErrorsOnSubmit: true
        });
      }
      
      // Add submit handler - this will work with FormValidator and security.js
      // FormValidator prevents submission if validation fails
      // security.js sanitizes inputs in capture phase
      // This handler processes the actual submission
      checkoutForm.addEventListener('submit', handleFormSubmit);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckout);
  } else {
    initCheckout();
  }
})();

