(() => {
    const hero = document.querySelector('.hero');
    const track = hero.querySelector('.hero-track');
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const dots = [...hero.querySelectorAll('.hero-dot')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let paused = reducedMotion.matches;
    let timer;

    function schedule() {
        window.clearInterval(timer);
        if (!paused && !hero.closest('[hidden]') && !hero.contains(document.activeElement) && !document.hidden) {
            timer = window.setInterval(() => show(current + 1), 5000);
        }
    }

    function show(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        slides.forEach((slide, i) => {
            slide.inert = i !== current;
            slide.setAttribute('aria-hidden', String(i !== current));
            if (i === current) dots[i].setAttribute('aria-current', 'true');
            else dots[i].removeAttribute('aria-current');
        });
    }

    hero.querySelector('.hero-controls').hidden = false;
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
        show(i);
        schedule();
    }));
    hero.addEventListener('focusin', schedule);
    hero.addEventListener('focusout', () => window.setTimeout(schedule, 0));
    document.addEventListener('visibilitychange', schedule);
    document.addEventListener('site:routechange', schedule);
    reducedMotion.addEventListener('change', () => {
        paused = reducedMotion.matches;
        schedule();
    });
    schedule();
})();
