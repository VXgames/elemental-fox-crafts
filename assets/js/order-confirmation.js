/**
 * Order Confirmation Page Handler
 * Displays order details from sessionStorage
 */

(function() {
  'use strict';

  // Generate order number
  function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `EFC-${timestamp}-${random}`;
  }

  // Format price
  function formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }

  // Load and display order confirmation
  function loadOrderConfirmation() {
    try {
      // Get order data from sessionStorage
      const orderData = sessionStorage.getItem('order_confirmation');
      
      if (!orderData) {
        // No order data found
        document.getElementById('order-confirmation-empty').style.display = 'block';
        document.getElementById('order-confirmation-details').style.display = 'none';
        return;
      }

      const order = JSON.parse(orderData);
      
      // Generate order number if not present
      if (!order.orderNumber) {
        order.orderNumber = generateOrderNumber();
      }

      // Display order number
      document.getElementById('order-number').textContent = order.orderNumber;

      // Display order date
      const orderDate = order.orderDate || new Date().toLocaleString();
      document.getElementById('order-date').textContent = orderDate;

      // Display total
      const total = (order.subtotal || 0) + (order.shipping || 0);
      document.getElementById('order-total').textContent = formatPrice(total);

      // Display order items
      const itemsList = document.getElementById('order-items-list');
      if (order.items && order.items.length > 0) {
        itemsList.innerHTML = '';
        order.items.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.className = 'order-item-row';
          itemElement.innerHTML = `
            <div class="order-item-name">${item.name} × ${item.quantity}</div>
            <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
          `;
          itemsList.appendChild(itemElement);
        });
      } else {
        itemsList.innerHTML = '<p>No items found</p>';
      }

      // Display shipping address
      const shippingAddress = document.getElementById('shipping-address');
      if (order.shippingAddress) {
        shippingAddress.innerHTML = `
          <p><strong>${order.shippingAddress.name}</strong></p>
          <p>${order.shippingAddress.address}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
          <p>${order.shippingAddress.country}</p>
        `;
      } else {
        shippingAddress.innerHTML = '<p>Shipping address not available</p>';
      }

      // Track conversion in Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: order.orderNumber,
          value: total,
          currency: 'USD',
          items: order.items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });
      }

    } catch (error) {
      console.error('Error loading order confirmation:', error);
      const errorMsg = 'Unable to load order details. Please check your email for confirmation.';
      if (window.showError) {
        window.showError(errorMsg);
      }
      document.getElementById('order-confirmation-empty').style.display = 'block';
      document.getElementById('order-confirmation-details').style.display = 'none';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadOrderConfirmation);
  } else {
    loadOrderConfirmation();
  }
})();

