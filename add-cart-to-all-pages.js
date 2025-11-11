/**
 * Script to add cart structure to all HTML pages
 * Run with: node add-cart-to-all-pages.js
 */

const fs = require('fs');
const path = require('path');

// Cart button HTML (to be inserted before Instagram icon)
const cartButton = `        <button class="cart-toggle" aria-label="Open shopping cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="cart-badge">0</span>
        </button>
`;

// Cart structure HTML (to be inserted after </header>)
const cartStructure = `    <!-- Cart Overlay -->
    <div class="cart-overlay"></div>

    <!-- Cart Sidebar -->
    <div class="cart-sidebar">
        <div class="cart-header">
            <h2>Shopping Cart</h2>
            <button class="cart-close" aria-label="Close cart">×</button>
        </div>
        <div class="cart-content">
            <div class="cart-empty">
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; color: var(--muted);">Add items to get started</p>
            </div>
            <div class="cart-items">
                <!-- Cart items will be dynamically added here -->
            </div>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span class="cart-total-label">Total:</span>
                <span class="cart-total-amount">$0.00</span>
            </div>
            <button class="cart-checkout-btn">Proceed to Checkout</button>
        </div>
    </div>

`;

// Cart script (to be inserted before </body>)
const cartScript = `    <script src="./assets/js/cart.js"></script>
`;

// Get all HTML files in root directory
function getHTMLFiles(dir) {
    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.html') && !file.includes('node_modules'));
}

// Process a single HTML file
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Check if cart is already added
        if (content.includes('cart-toggle') && content.includes('cart-sidebar') && content.includes('cart.js')) {
            console.log(`✓ ${path.basename(filePath)} - Cart already added`);
            return false;
        }

        // Add cart button before Instagram icon
        if (!content.includes('cart-toggle')) {
            const instagramIconPattern = /(<a href="https:\/\/www\.instagram\.com\/elementalfoxcrafts\/"[^>]*class="header-instagram-icon"[^>]*>)/;
            if (instagramIconPattern.test(content)) {
                content = content.replace(instagramIconPattern, cartButton + '        $1');
                modified = true;
                console.log(`  → Added cart button to ${path.basename(filePath)}`);
            }
        }

        // Add cart structure after </header>
        if (!content.includes('cart-sidebar')) {
            const headerClosePattern = /(<\/header>)/;
            if (headerClosePattern.test(content)) {
                content = content.replace(headerClosePattern, '$1\n' + cartStructure);
                modified = true;
                console.log(`  → Added cart structure to ${path.basename(filePath)}`);
            }
        }

        // Add cart script before </body>
        if (!content.includes('cart.js')) {
            // Find the last script tag or </body>
            const bodyClosePattern = /(<\/body>)/;
            if (bodyClosePattern.test(content)) {
                // Try to add before </body>, but after other scripts if they exist
                const scriptPattern = /(<script[^>]*><\/script>\s*)(<\/body>)/;
                if (scriptPattern.test(content)) {
                    content = content.replace(scriptPattern, '$1' + cartScript + '$2');
                } else {
                    content = content.replace(bodyClosePattern, cartScript + '$1');
                }
                modified = true;
                console.log(`  → Added cart script to ${path.basename(filePath)}`);
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated ${path.basename(filePath)}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main function
function main() {
    const rootDir = __dirname;
    const htmlFiles = getHTMLFiles(rootDir);

    console.log('Adding cart to HTML pages...\n');
    console.log(`Found ${htmlFiles.length} HTML files\n`);

    let updatedCount = 0;
    htmlFiles.forEach(file => {
        const filePath = path.join(rootDir, file);
        if (processFile(filePath)) {
            updatedCount++;
        }
    });

    console.log(`\n✓ Done! Updated ${updatedCount} files.`);
    console.log('\nNext steps:');
    console.log('1. Test the cart on a few pages');
    console.log('2. Set up EmailJS (see CART_SETUP_GUIDE.md)');
    console.log('3. Update checkout.html with your EmailJS credentials');
}

// Run the script
main();

