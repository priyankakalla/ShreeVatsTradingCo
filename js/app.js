(() => {
    const { company, products, pages } = window.siteData;
    const home = document.querySelector('#home-content');
    const content = document.querySelector('#page-content');
    const submenu = document.querySelector('.submenu');
    const grid = document.querySelector('.category-grid');
    const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
    const routeLink = (slug) => `#${encodeURIComponent(slug)}`;
    const about = pages['about-us'];
    document.querySelector('#home-about-copy').innerHTML = about.paragraphs.slice(0, 2)
        .map((paragraph) => `<p>${escape(paragraph)}</p>`).join('');
    document.querySelector('#home-about-facts').innerHTML = about.facts
        .filter((fact) => ['Established', 'Nature of business', 'Proprietor', 'Location'].includes(fact.label))
        .map((fact) => `<div><dt>${escape(fact.label)}</dt><dd>${escape(fact.value)}</dd></div>`).join('');
    const contact = pages['contact-us'];
    const whatsappUrl = `https://wa.me/${contact.whatsapp}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
    const contactIcons = {
        email: '<path d="M3 4h18a1 1 0 0 1 1 1v1l-10 7L2 6V5a1 1 0 0 1 1-1Zm-1 4.4 9.4 6.6a1 1 0 0 0 1.2 0L22 8.4V19a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z"/>',
        mobile: '<path d="M6.6 10.8a15.7 15.7 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.55 3.6.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.19 2.5.55 3.6a1 1 0 0 1-.24 1Z"/>',
        location: '<path fill-rule="evenodd" d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>',
        whatsapp: '<path d="M16 .8A15.1 15.1 0 0 0 3 23.6L.9 31.2l7.8-2A15.1 15.1 0 1 0 16 .8Zm0 27.4a12.2 12.2 0 0 1-6.2-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5A12.3 12.3 0 1 1 16 28.2Zm6.8-9.2c-.4-.2-2.2-1.1-2.5-1.2-.4-.1-.6-.2-.9.2l-1.2 1.5c-.2.2-.4.3-.8.1a10 10 0 0 1-2.9-1.8 11 11 0 0 1-2-2.5c-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.1-2.6c-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.5 1.5 3.7c.2.3 2.6 4 6.3 5.6l2.1.7c.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5Z"/>'
    };
    const contactLink = (kind, url, label) => `<a class="contact-link" href="${escape(url)}"><svg class="contact-icon" viewBox="0 0 ${kind === 'whatsapp' ? '32 32' : '24 24'}" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">${contactIcons[kind]}</svg><span>${escape(label)}</span></a>`;
    document.querySelector('[data-company-name]').textContent = company;
    document.querySelector('#footer-description').textContent = pages['about-us'].paragraphs[0];
    document.querySelector('#footer-contact').innerHTML = `
        <p>${contactLink('mobile', `tel:${contact.phone.replace(/[^+\d]/g, '')}`, `Mobile: ${contact.phone}`)}</p>
        <p>${contactLink('whatsapp', whatsappUrl, `WhatsApp: ${contact.phone}`)}</p>
        <p>${contactLink('location', mapUrl, contact.address)}</p>`;
    if (contact.email) document.querySelector('#footer-contact').innerHTML += `<p>${contactLink('email', `mailto:${contact.email}`, contact.email)}</p>`;
    document.querySelector('#footer-copyright').textContent = `\u00a9 ${new Date().getFullYear()} ${company}`;
    document.querySelector('#whatsapp-link').href = whatsappUrl;

    submenu.innerHTML = products.map((product) =>
        `<li><a href="${routeLink(product.slug)}">${escape(product.name)}</a></li>`
    ).join('');
    const productCards = (items) => items.map((product) => `
        <article class="category-card">
            <a class="category-link" href="${routeLink(product.slug)}">
                <div class="category-image${product.imageFit === 'contain' ? ' product-photo' : ''}"><img src="${escape(product.image)}" alt="${escape(product.alt)}" loading="lazy"></div>
                <h2>${escape(product.name)}</h2>
            </a>
            ${product.category ? `<p class="product-category">${escape(product.category)}</p>` : ''}
            ${product.description !== product.name ? `<p>${escape(product.description)}</p>` : ''}
            ${product.priceLabel ? `<p class="product-price">${escape(product.priceLabel)}</p>` : ''}
            <a class="category-explore" href="${routeLink(product.slug)}">Explore product <span aria-hidden="true">&#8594;</span><span class="visually-hidden">: ${escape(product.name)}</span></a>
        </article>`).join('');

    const featuredProducts = window.siteData.featuredProducts
        .map((slug) => products.find((product) => product.slug === slug))
        .filter(Boolean);
    const productsToggle = document.querySelector('#toggle-products');
    grid.innerHTML = productCards(featuredProducts);
    productsToggle.addEventListener('click', () => {
        const expanded = productsToggle.getAttribute('aria-expanded') !== 'true';
        grid.innerHTML = productCards(expanded ? products : featuredProducts);
        grid.classList.toggle('featured-grid', !expanded);
        productsToggle.setAttribute('aria-expanded', String(expanded));
        productsToggle.textContent = expanded ? 'View Less \u2191' : 'View All Products \u2192';
        if (!expanded) {
            productsToggle.focus({ preventScroll: true });
            productsToggle.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }
    });

    function render(moveFocus = false) {
        let route;
        try { route = decodeURIComponent(location.hash.slice(1)) || 'home'; }
        catch { route = 'not-found'; }
        const isHome = route === 'home';
        const product = products.find((item) => item.slug === route);
        const page = Object.prototype.hasOwnProperty.call(pages, route) ? pages[route] : null;
        let title = 'Home';
        let body = '';
        home.hidden = !isHome;
        content.hidden = isHome;

        if (product) {
            title = product.name;
            body = `<div class="product-detail">
                <div class="category-image${product.imageFit === 'contain' ? ' product-photo' : ''}"><img src="${escape(product.image)}" alt="${escape(product.alt)}"></div>
                <div><p>${escape(product.description)}</p>
                    ${product.category ? `<dl class="product-facts"><div><dt>Category</dt><dd>${escape(product.category)}</dd></div><div><dt>Product reference</dt><dd>${escape(product.sourceId)}</dd></div><div><dt>Price</dt><dd>${escape(product.priceLabel)}</dd></div></dl>` : ''}
                    <a class="page-action" href="#contact-us">Contact us about this product</a>
                    <a class="page-action secondary" href="#products">Browse all products</a>
                </div></div>`;
        } else if (route === 'products') {
            title = 'All Products';
            body = `<div class="category-grid">${productCards(products)}</div>`;
        } else if (page) {
            title = page.title;
            body = page.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('');
            if (page.facts) {
                body += `<h2>Company Profile</h2><dl class="company-facts">${page.facts.map((fact) => `<div><dt>${escape(fact.label)}</dt><dd>${escape(fact.value)}</dd></div>`).join('')}</dl>`;
            }
            if (route === 'contact-us') {
                if (page.email) body += `<p><a href="mailto:${escape(page.email)}">${escape(page.email)}</a></p>`;
                if (page.phone) body += `<p>${contactLink('mobile', `tel:${page.phone.replace(/[^+\d]/g, '')}`, `Mobile: ${page.phone}`)}</p>`;
                if (page.address) body += `<p>${contactLink('location', mapUrl, page.address)}</p>`;
                if (page.whatsapp) body += `<p>${contactLink('whatsapp', whatsappUrl, `WhatsApp: ${page.phone}`)}</p>`;
            }
        } else if (route === 'site-map') {
            title = 'Site Map';
            const links = [{ slug: 'home', name: 'Home' },
                { slug: 'products', name: 'All Products' },
                ...Object.entries(pages).map(([slug, value]) => ({ slug, name: value.title })),
                ...products];
            body = `<ul class="site-map-links">${links.map((item) => `<li><a href="${routeLink(item.slug)}">${escape(item.name)}</a></li>`).join('')}</ul>`;
        } else if (!isHome) {
            title = 'Page not found';
            body = '<p>This page is unavailable. <a href="#home">Return to our products</a>.</p>';
        }

        if (!isHome) content.innerHTML = `<a class="back-link" href="#home">&#8592; Home</a><h1 id="page-heading" tabindex="-1">${escape(title)}</h1>${body}`;
        document.title = isHome ? company : `${title} | ${company}`;
        document.querySelectorAll('.nav-list a').forEach((link) => {
            if (link.getAttribute('href') === routeLink(route)) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
        const navbar = document.querySelector('.navbar');
        navbar.classList.remove('menu-open');
        const toggle = navbar.querySelector('.nav-toggle');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        navbar.querySelector('.products-menu').open = false;
        if (moveFocus) {
            const heading = isHome ? document.querySelector('#categories-heading') : content.querySelector('h1');
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        document.dispatchEvent(new Event('site:routechange'));
    }

    window.addEventListener('hashchange', () => render(true));
    render();
})();
