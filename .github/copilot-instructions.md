## Quick orientation

This is a minimal static website (single-page `index.html` + `style.css`) for Elemental Fox Crafts. There is no build system, server, or tests in the repository — this is plain HTML/CSS intended to be previewed in a browser.

Key files to reference:
- `index.html` — main page markup (navigation, `.hero`, `.featured`, `.categories-grid`, `.category-card`). Example selectors: `.btn-primary`, `.btn-secondary`, `.category-image`.
- `style.css` — global styles and layout (CSS Grid for `.categories-grid`, responsive `minmax(auto-fit, minmax(...))` pattern, fonts imported via Google Fonts link in `index.html`).

What to expect from the codebase
- Static assets are not present — `category-image` divs are placeholders (text placeholders rather than `<img>` tags). If adding images, prefer `<img>` with appropriate alt text or update `.category-image` background-image rules.
- Navigation links reference pages (`shop.html`, `about.html`, `contact.html`) that may not exist yet. When adding pages, keep paths relative.
- Typography: `Inter` for body, `Playfair Display` for headings — preserved via the link element in `index.html`.

Agent guidance (do these things first)
1. Work locally by opening `index.html` in a browser or use the VS Code Live Server extension to preview changes live.
2. When editing styles, prefer adding rules in `style.css` and follow existing naming (e.g., `.btn-primary`, `.btn-secondary`, `.category-card`). Keep CSS organized: resets at top, layout sections grouped (navigation, hero, featured, footer).
3. For images: replace the placeholder `.category-image` content with an `<img>` element and add responsive width/height attributes, or add `background-image` in CSS and keep the placeholder structure.
4. For new pages, copy `index.html` as a template and update only the main content area; keep the header/nav/footer structure consistent across pages.

Project-specific conventions and patterns
- Visual components are class-based (no utility classes). Reuse `.btn-primary` / `.btn-secondary` for CTA links.
- Layout uses CSS Grid for card collections (`.categories-grid`) and Flexbox for navbar alignment.
- Keep hero content center-aligned and accessible — headings are semantic (`h1`, `h2`, etc.).

Integration points and external dependencies
- Google Fonts are loaded via the `<link>` in `index.html`. Avoid duplicating font imports in `style.css`.
- No JS, backend, or package manager integrations present. If adding JS or build tooling, document new files and update this instructions file.

Examples you can reference
- To add a featured card image, replace the placeholder block in `index.html`:
  - Current: `<div class="category-image">Copper Spoons Image</div>`
  - Prefer: `<img src="/assets/images/copper-spoon.jpg" alt="Copper spoons" class="category-image" />` and adapt CSS to target `.category-image img`.

Edge notes for automation agents
- Do not assume additional pages exist. Run local link checks before mass-editing navigation.
- No tests or CI detected — if you add automation, include instructions and a small check (e.g., an HTML validator or a basic link-check script) and update this file.

If anything here is incorrect or you want the AI to follow stricter conventions (naming schema, componentization, or adding build tooling), tell me what to enforce and I will update these instructions and the repo accordingly.
