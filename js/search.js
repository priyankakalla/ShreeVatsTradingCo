(() => {
    const dialog = document.querySelector('#search-dialog');
    const openButton = document.querySelector('#open-search');
    const input = document.querySelector('#product-search');
    const results = document.querySelector('#search-results');
    const status = document.querySelector('#search-status');

    function search() {
        const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        const matches = window.siteData.products.filter((product) => {
            const text = `${product.name} ${product.description} ${product.category || ''} ${product.sourceId || ''}`.toLowerCase();
            return terms.every((term) => text.includes(term));
        });
        results.replaceChildren();
        matches.forEach((product) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${encodeURIComponent(product.slug)}`;
            const duplicateName = window.siteData.products.filter(item => item.name === product.name).length > 1;
            link.textContent = duplicateName && product.sourceId ? `${product.name} (Ref. ${product.sourceId})` : product.name;
            item.append(link);
            results.append(item);
        });
        status.textContent = matches.length ? `${matches.length} products found` : 'No products found. Try a different search.';
    }

    openButton.addEventListener('click', () => {
        input.value = '';
        search();
        dialog.showModal();
        document.body.classList.add('search-open');
        input.focus();
    });
    input.addEventListener('input', search);
    dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
    results.addEventListener('click', (event) => {
        if (event.target.closest('a')) dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('search-open');
        openButton.focus({ preventScroll: true });
    });
    window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
})();
