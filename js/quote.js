(() => {
    const dialog = document.querySelector('#quote-dialog');
    const form = document.querySelector('#quote-form');
    const productSelect = form.elements.product;
    const phone = form.elements.phone;
    const customerName = form.elements.customerName;
    const status = document.querySelector('#quote-status');
    const openButton = document.querySelector('#open-quote');
    let quoteTrigger = openButton;
    const submitButton = form.querySelector('[type="submit"]');
    let submitting = false;

    window.siteData.products.forEach((product) => {
        const duplicateName = window.siteData.products.filter(item => item.name === product.name).length > 1;
        const label = duplicateName && product.sourceId ? `${product.name} (Ref. ${product.sourceId})` : product.name;
        productSelect.add(new Option(label, product.slug));
    });

    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-quote-open]');
        if (!button) return;
        quoteTrigger = button;
        if (button.dataset.quoteProduct) productSelect.value = button.dataset.quoteProduct;
        if (!submitting) status.textContent = '';
        dialog.showModal();
        document.body.classList.add('quote-open');
        productSelect.focus();
    });
    dialog.querySelector('.quote-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('quote-open');
        const navToggle = document.querySelector('.nav-toggle');
        const target = quoteTrigger.getClientRects().length ? quoteTrigger :
            (navToggle.getClientRects().length ? navToggle : document.querySelector('#open-search'));
        target.focus({ preventScroll: true });
    });
    window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
    phone.addEventListener('input', () => phone.setCustomValidity(''));
    customerName.addEventListener('input', () => customerName.setCustomValidity(''));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (submitting) return;
        customerName.setCustomValidity(customerName.value.trim() ? '' : 'Enter your name.');
        const number = phone.value.trim();
        const digits = number.replace(/\D/g, '');
        const validPhone = /^\+?[\d\s().-]+$/.test(number) && digits.length >= 7 && digits.length <= 15;
        phone.setCustomValidity(validPhone ? '' : 'Enter a valid phone number with 7 to 15 digits.');
        if (!form.reportValidity()) return;

        const product = window.siteData.products.find((item) => item.slug === productSelect.value);
        if (!product) return;
        const data = new FormData(form);
        data.set('productName', product.name);
        data.set('customerName', customerName.value.trim());
        data.set('phone', number);
        data.set('_subject', `Quote request: ${product.name}`);
        if (product.sourceId) data.set('productReference', product.sourceId);
        submitting = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        form.setAttribute('aria-busy', 'true');
        status.textContent = 'Sending your quote request...';
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch(form.action, {
                method: form.method.toUpperCase(),
                body: data,
                headers: { Accept: 'application/json' },
                signal: controller.signal
            });
            if (!response.ok) throw new Error('Submission failed');
            form.reset();
            status.textContent = 'Thank you! Your quote request has been sent. We will contact you with pricing.';
        } catch {
            status.textContent = 'We could not confirm your request. Please try again or contact us by phone, WhatsApp, or email.';
        } finally {
            window.clearTimeout(timeout);
            submitting = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Request Quote';
            form.removeAttribute('aria-busy');
        }
    });
})();
