/**
 * Social Sharing Module
 * Handles sharing products to social media platforms
 */

(function() {
  'use strict';

  // Get current page URL
  function getCurrentUrl() {
    return window.location.href;
  }

  // Get page title
  function getPageTitle() {
    return document.title || 'Elemental Fox Crafts';
  }

  // Get product data from page
  function getProductData() {
    const titleEl = document.getElementById('product-title');
    const priceEl = document.getElementById('product-price');
    const imageEl = document.getElementById('main-product-image');
    const descEl = document.getElementById('product-description');
    
    return {
      title: titleEl ? titleEl.textContent.trim() : getPageTitle(),
      price: priceEl ? priceEl.textContent.trim() : '',
      image: imageEl ? imageEl.src : '',
      description: descEl ? descEl.textContent.trim().substring(0, 200) : '',
      url: getCurrentUrl()
    };
  }

  // Share to Facebook
  function shareToFacebook(productData) {
    const url = encodeURIComponent(productData.url);
    const text = encodeURIComponent(`${productData.title} - ${productData.price}`);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    
    window.open(
      shareUrl,
      'facebook-share',
      'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
    );
  }

  // Share to Twitter/X
  function shareToTwitter(productData) {
    const url = encodeURIComponent(productData.url);
    const text = encodeURIComponent(`Check out ${productData.title} - ${productData.price} from Elemental Fox Crafts!`);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    
    window.open(
      shareUrl,
      'twitter-share',
      'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
    );
  }

  // Share to Pinterest
  function shareToPinterest(productData) {
    const url = encodeURIComponent(productData.url);
    const media = encodeURIComponent(productData.image);
    const description = encodeURIComponent(`${productData.title} - ${productData.price}`);
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`;
    
    window.open(
      shareUrl,
      'pinterest-share',
      'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
    );
  }

  // Copy link to clipboard
  async function copyLinkToClipboard(productData) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(productData.url);
        if (window.showSuccess) {
          window.showSuccess('Link copied to clipboard!');
        } else if (window.showInfo) {
          window.showInfo('Link copied to clipboard!');
        }
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = productData.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (window.showSuccess) {
          window.showSuccess('Link copied to clipboard!');
        } else if (window.showInfo) {
          window.showInfo('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      if (window.showError) {
        window.showError('Failed to copy link. Please try again.');
      }
    }
  }

  // Share via email
  function shareViaEmail(productData) {
    const subject = encodeURIComponent(`Check out ${productData.title} from Elemental Fox Crafts`);
    const body = encodeURIComponent(
      `I thought you might like this product:\n\n${productData.title}\n${productData.price}\n\n${productData.description}\n\nView it here: ${productData.url}`
    );
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
  }

  // Share to Instagram (best-effort)
  async function shareToInstagram(productData) {
    const sharePayload = {
      title: productData.title,
      text: `${productData.title}${productData.price ? ` - ${productData.price}` : ''} from Elemental Fox Crafts`,
      url: productData.url
    };

    try {
      if (navigator.canShare && navigator.canShare(sharePayload)) {
        await navigator.share(sharePayload);
        return;
      }
    } catch (error) {
      console.warn('Native share failed, falling back to manual Instagram flow.', error);
    }

    try {
      await copyLinkToClipboard(productData);
      if (window.showInfo) {
        window.showInfo('Link copied! Open Instagram to create a post or story.');
      } else if (window.showSuccess) {
        window.showSuccess('Link copied! Open Instagram to share.');
      }
    } catch (error) {
      console.error('Failed to copy link for Instagram share:', error);
    }

    window.open(
      'https://www.instagram.com/',
      'instagram-share',
      'width=1200,height=800,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
    );
  }

  // Setup social sharing buttons
  function setupSocialSharingButtons() {
    const container = document.getElementById('product-social-sharing');
    if (!container) return;

    const productData = getProductData();

    // Create share buttons
    const buttons = [
      {
        name: 'Facebook',
        icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
        action: () => shareToFacebook(productData),
        ariaLabel: 'Share on Facebook'
      },
      {
        name: 'Twitter',
        icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
        action: () => shareToTwitter(productData),
        ariaLabel: 'Share on X (Twitter)'
      },
      {
        name: 'Pinterest',
        icon: 'M12.17 0C5.63 0 1.06 5.09 1.06 11.17c0 4.83 2.99 8.95 7.24 10.6-.1-.9-.19-2.28.04-3.26.21-.9 1.36-6.01 1.36-6.01s-.35-.7-.35-1.73c0-1.62.94-2.83 2.11-2.83 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.89-.28 1.18.59 2.14 1.75 2.14 2.1 0 3.71-2.22 3.71-5.42 0-2.83-2.04-4.81-4.95-4.81-3.37 0-5.35 2.53-5.35 5.14 0 1.01.39 2.1.88 2.69a.35.35 0 0 1 .04.42c-.04.16-.13.5-.15.57-.02.08-.06.1-.14.06-.53-.25-.86-1.02-.86-1.64 0-2.12 1.54-4.07 4.45-4.07 2.34 0 4.16 1.67 4.16 3.9 0 2.6-1.64 4.8-3.9 4.8-.76 0-1.48-.4-1.72-.88l-.47 1.79c-.17.66-.63 1.49-.94 2-.71 1.06-2.75 2.38-3.89 3.19.29.25.6.49.93.71A12 12 0 0 0 12.17 24c6.54 0 12.11-5.09 12.11-11.17C24.28 5.09 18.71 0 12.17 0z',
        action: () => shareToPinterest(productData),
        ariaLabel: 'Share on Pinterest'
      },
      {
        name: 'Instagram',
        icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10.5 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
        action: () => shareToInstagram(productData),
        ariaLabel: 'Share on Instagram'
      },
      {
        name: 'Email',
        icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
        action: () => shareViaEmail(productData),
        ariaLabel: 'Share via Email'
      },
      {
        name: 'Copy Link',
        icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
        action: () => copyLinkToClipboard(productData),
        ariaLabel: 'Copy link to clipboard'
      }
    ];

    // Clear container
    container.innerHTML = '';

    // Create label
    const label = document.createElement('span');
    label.className = 'social-sharing-label';
    label.textContent = 'Share:';
    container.appendChild(label);

    // Create buttons
    buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `social-share-btn social-share-btn-${button.name.toLowerCase().replace(' ', '-')}`;
      btn.setAttribute('aria-label', button.ariaLabel);
      btn.setAttribute('title', button.ariaLabel);
      
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="${button.icon}"></path>
        </svg>
        <span class="sr-only">${button.name}</span>
      `;
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        button.action();
      });
      
      container.appendChild(btn);
    });
  }

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupSocialSharingButtons);
    } else {
      setupSocialSharingButtons();
    }
  }

  // Expose API
  window.SocialSharing = {
    setup: setupSocialSharingButtons,
    shareToFacebook,
    shareToTwitter,
    shareToPinterest,
    shareToInstagram,
    copyLinkToClipboard,
    shareViaEmail,
    getProductData
  };

  // Auto-initialize
  init();
})();

