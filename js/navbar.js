function setupNavbar() {
    const navLinks = document.querySelector('header .nav-links');
    const nav = document.querySelector('header .nav');

    if (!nav || !navLinks) return;

    // Shared, accessible navigation controls for every site page.
    navLinks.id = navLinks.id || 'site-nav-links';

    const hamburger = document.createElement('button');
    hamburger.type = 'button';
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'فتح القائمة الرئيسية');
    hamburger.setAttribute('aria-controls', navLinks.id);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span aria-hidden="true">☰</span>';
    nav.insertBefore(hamburger, navLinks);

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'close-menu';
    closeBtn.innerHTML = '<span>إغلاق القائمة</span><span aria-hidden="true">✕</span>';
    navLinks.insertBefore(closeBtn, navLinks.firstChild);

    let previousOverflow = '';
    function setMenuOpen(open, restoreFocus = false) {
        const wasOpen = navLinks.classList.contains('active');
        if (open === wasOpen) return;

        navLinks.classList.toggle('active', open);
        overlay.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'إغلاق القائمة الرئيسية' : 'فتح القائمة الرئيسية');

        if (open) {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        } else {
            document.body.style.overflow = previousOverflow;
            if (restoreFocus) hamburger.focus();
        }
    }

    hamburger.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('active'));
    });
    closeBtn.addEventListener('click', () => setMenuOpen(false, true));
    overlay.addEventListener('click', () => setMenuOpen(false));
    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            setMenuOpen(false, true);
        }
    });

    // Keep the desktop navigation visible after a viewport/orientation change.
    const mobileViewport = window.matchMedia('(max-width: 900px)');
    mobileViewport.addEventListener('change', (event) => {
        if (!event.matches) setMenuOpen(false);
    });

    // Highlight the current destination without changing the page's links.
    navLinks.querySelectorAll('a[href]').forEach((link) => {
        try {
            if (new URL(link.href, window.location.href).pathname === window.location.pathname) {
                link.setAttribute('aria-current', 'page');
            }
        } catch (_) {
            // Ignore unsupported external or malformed link values.
        }
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('/html/') ? '../sw.js' : 'sw.js';
            navigator.serviceWorker.register(swPath).catch(err => {
                console.log('SW registration failed: ', err);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', setupNavbar);
