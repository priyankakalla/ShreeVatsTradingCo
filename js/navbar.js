(() => {
    const navbar = document.querySelector('.navbar');
    const toggle = navbar.querySelector('.nav-toggle');
    const menu = navbar.querySelector('.nav-list');
    const mobileLayout = window.matchMedia('(max-width: 1200px)');

    function setMenu(open, restoreFocus = false) {
        navbar.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        if (!open) navbar.querySelector('.products-menu').open = false;
        if (restoreFocus) toggle.focus();
    }

    navbar.classList.add('menu-ready');
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target)) setMenu(false);
    });
    navbar.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navbar.classList.contains('menu-open')) {
            setMenu(false, true);
        }
    });
    menu.addEventListener('click', (event) => {
        if (event.target.closest('a') && mobileLayout.matches) setMenu(false, true);
    });
    navbar.addEventListener('focusout', (event) => {
        if (!navbar.contains(event.relatedTarget)) setMenu(false);
    });
    mobileLayout.addEventListener('change', () => {
        const focusWillHide = mobileLayout.matches && menu.contains(document.activeElement);
        const toggleHadFocus = document.activeElement === toggle;
        setMenu(false, focusWillHide);
        if (!mobileLayout.matches && toggleHadFocus) menu.querySelector('a').focus();
    });

    function updateNavbar() {
        navbar.classList.toggle('is-scrolled', window.scrollY > 0);
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('pageshow', updateNavbar);
    updateNavbar();
})();
