/**
 * About Page Content Loader
 * Dynamically loads content from about.json
 */

(async function() {
  'use strict';

  function convertImagePath(path) {
    if (!path) return '';
    // Convert Windows-style paths (backslashes) to web paths (forward slashes)
    let imagePath = path.replace(/\\/g, '/');
    // Ensure path starts with ./ for relative paths
    if (!imagePath.startsWith('/') && !imagePath.startsWith('http') && !imagePath.startsWith('.')) {
      imagePath = './' + imagePath;
    }
    return imagePath;
  }

  async function loadAboutContent() {
    try {
      console.log('Loading about page content...');
      
      const response = await fetch('./assets/data/about.json');
      if (!response.ok) {
        throw new Error(`Failed to load about content: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('About content loaded successfully:', data);
      
      // Update page title
      const pageHeader = document.querySelector('.page-header h2');
      if (pageHeader && data.page.title) {
        pageHeader.textContent = data.page.title;
      }
      
      // Update about text content
      const aboutText = document.querySelector('.about-content .about-text');
      if (aboutText && data.page.sections) {
        aboutText.innerHTML = '';
        data.page.sections.forEach(section => {
          if (section.type === 'text') {
            const paragraph = document.createElement('p');
            paragraph.textContent = section.content;
            aboutText.appendChild(paragraph);
          }
        });
      }
      
      // Update about image
      const aboutImage = document.querySelector('.about-content .about-image');
      if (aboutImage && data.page.image) {
        const imagePath = convertImagePath(data.page.image.path);
        aboutImage.innerHTML = `<img src="${imagePath}" alt="${data.page.image.alt || 'About Elemental Fox Crafts'}" onerror="console.error('Failed to load image: ${imagePath}')">`;
      }
      
      console.log('About page content loaded successfully!');
    } catch (error) {
      console.error('Error loading about page content:', error);
      console.error('Error details:', error.message);
      
      // Display error message on page
      const aboutContent = document.querySelector('.about-content');
      if (aboutContent) {
        aboutContent.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: #d32f2f;">
            <p><strong>Error loading content:</strong> ${error.message}</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check the browser console for more details.</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #666;">
              <strong>Note:</strong> If you're opening this file directly (file://), you may need to use a local web server.
            </p>
          </div>
        `;
      }
    }
  }

  // Load content when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAboutContent);
  } else {
    loadAboutContent();
  }
})();

