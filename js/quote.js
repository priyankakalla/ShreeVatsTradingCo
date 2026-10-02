(() => {
    const dialog = document.querySelector('#quote-dialog');
    const form = document.querySelector('#quote-form');
    const productSelect = form.elements.product;
    const phone = form.elements.phone;
    const customerName = form.elements.customerName;
    const status = document.querySelector('#quote-status');
    const openButton = document.querySelector('#open-quote');

    window.siteData.products.forEach((product) => {
        productSelect.add(new Option(product.name, product.slug));
    });

    openButton.addEventListener('click', () => {
        status.textContent = '';
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
        openButton.focus({ preventScroll: true });
    });
    window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
    phone.addEventListener('input', () => phone.setCustomValidity(''));
    customerName.addEventListener('input', () => customerName.setCustomValidity(''));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        customerName.setCustomValidity(customerName.value.trim() ? '' : 'Enter your name.');
        const number = phone.value.trim();
        const digits = number.replace(/\D/g, '');
        const validPhone = /^\+?[\d\s().-]+$/.test(number) && digits.length >= 7 && digits.length <= 15;
        phone.setCustomValidity(validPhone ? '' : 'Enter a valid phone number with 7 to 15 digits.');
        if (!form.reportValidity()) return;

        const product = window.siteData.products.find((item) => item.slug === productSelect.value);
        if (!product) return;
        const sellerEmail = window.siteData.pages['contact-us'].email.trim();
        if (!sellerEmail) {
            status.textContent = 'Online quote requests are not available yet. Your request has not been sent.';
            return;
        }
        const subject = `Quote request: ${product.name}`;
        const body = `Hello,\n\nPlease send your best price for:\nProduct: ${product.name}\nQuantity: ${form.elements.quantity.value}\nCustomer name: ${customerName.value.trim()}\nCustomer phone: ${number}\nCustomer email: ${form.elements.email.value.trim()}\n\nPlease contact me with your quote.`;
        window.location.href = `mailto:${encodeURIComponent(sellerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.textContent = 'Your email app will open with the enquiry. Send the email there to complete your request. If it does not open, please contact us by email.';
    });
})();
