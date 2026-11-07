(() => {
    const home = document.querySelector('#home-content');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!home || reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const sections = home.querySelectorAll(':scope > section, :scope > .hero-quote-cta');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || home.hidden) return;
            entry.target.classList.add('home-fade-in-up');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    reducedMotion.addEventListener('change', (event) => {
        if (!event.matches) return;
        observer.disconnect();
        sections.forEach((section) => section.classList.remove('home-fade-in-up'));
    });
})();
