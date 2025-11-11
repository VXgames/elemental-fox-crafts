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
      return JSON.parse(cartData);
    } catch (error) {
      console.error('Error loading checkout data:', error);
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
          <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.style.display='none';">
        </div>
        <div class="checkout-item-details">
          <h4>${item.name}</h4>
          <p>Quantity: ${item.quantity}</p>
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
        order_subtotal: formatPrice(cartData.total),
        order_shipping: formatPrice(cartData.shipping || 0),
        order_total: formatPrice((cartData.total || 0) + (cartData.shipping || 0)),
        payment_method: formData.paymentMethod || 'Not specified',
        order_items: cartData.items.map(item => 
          `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
        ).join('\n'),
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
      console.error('Error sending email:', error);
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
        console.error('Payment error:', error);
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

    // Get form data
    const formData = {
      customerName: document.getElementById('customer-name').value,
      customerEmail: document.getElementById('customer-email').value,
      customerPhone: document.getElementById('customer-phone').value,
      customerAddress: document.getElementById('customer-address').value,
      customerCity: document.getElementById('customer-city').value,
      customerState: document.getElementById('customer-state').value,
      customerZip: document.getElementById('customer-zip').value,
      customerCountry: document.getElementById('customer-country').value,
      customerNotes: document.getElementById('customer-notes').value,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'other'
    };

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

        // Clear cart regardless of email result
        if (window.cartAPI && window.cartAPI.clearCart) {
          window.cartAPI.clearCart();
        }
        sessionStorage.removeItem('checkout_cart');
        
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
        console.error('Error processing order:', error);
        const errorMsg = 'There was an error processing your order. Please try again or contact us directly.';
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
      });
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

