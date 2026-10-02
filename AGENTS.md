# Project memory

## User preference: responsive design

Make every new section and every UI change responsive for desktop, iPad/tablet, and phone screens. Apply this by default without waiting for the user to ask again.

- Support portrait and landscape orientations with flexible layouts and appropriate breakpoints.
- Keep text readable, images proportional, and content within the viewport without unintended horizontal scrolling.
- Adapt navigation, dropdowns, carousels, product grids, and spacing to the available screen width.
- Keep links and controls usable with touch, mouse, and keyboard. Do not rely on hover alone.
- Preserve access to content and controls on smaller screens.
- When verifying layout changes, check representative phone (375px), tablet (768px and 1024px), and desktop (1440px) widths where browser tools are available. Report any verification limitations accurately.

## Current site

- Main page: `index.html`; styles: `css/style.css`.
- This is a single-page site. Navigation uses hash routes (for example `#industrial-valves`), managed by `js/app.js`. Do not create separate HTML files for product or navigation pages.
- Maintain product names, descriptions, images, and About/Contact content in `js/site-data.js`. The dropdown, category cards, product detail views, and site map are generated from this shared data.
- Contact details have not been provided. Keep them empty until the user supplies them; do not invent them.
- Navbar behavior: `js/navbar.js`; automatic carousel: `js/carousel.js`.
- Product categories use circular images with names and descriptions below them.
- Keep the compact six-column product grid on wide desktops, adapting the number of columns for smaller screens.
- Home initially shows four featured products in one desktop row: bearings, valves, string wound filter cartridge, and steel flanges. Maintain this selection in `site-data.js` under `featuredProducts`. The View All Products button expands the complete catalog on the home page without changing routes; View Less restores the four featured products. Keep `#products` available for other catalog links.
