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


    // Self-contained line icons: no icon font, remote requests, or text replacements.
    // The href filename makes the same icon work from / and /html/ pages.
    const iconPaths = {
        'index.html': '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
        'arabic.html': '<path d="M12 7c-2-1.5-4.5-2-9-2v14c4.5 0 7 .5 9 2 2-1.5 4.5-2 9-2V5c-4.5 0-7 .5-9 2Z"/><path d="M12 7v14"/>',
        'english.html': '<path d="M3 19 9 5l6 14M5.5 14h7"/><path d="M17 5h4M19 5v14M17 19h4"/>',
        'numbers.html': '<path d="M5 9h14M4 15h14M11 3 7 21M17 3l-4 18"/>',
        'animals.html': '<circle cx="5" cy="9" r="1"/><circle cx="10" cy="5.5" r="1"/><circle cx="16" cy="5.5" r="1"/><circle cx="20" cy="9" r="1"/><path d="M12 12c-2 0-3 3-5 4.5-1.6 1.2-1 4.5 2 4.5 1.3 0 1.9-.7 3-1 1.1.3 1.7 1 3 1 3 0 3.6-3.3 2-4.5C15 15 14 12 12 12z"/>',
        'shapes.html': '<rect x="2.5" y="3" width="8" height="8" rx="1.5"/><circle cx="17.5" cy="7" r="4"/><path d="m7 15-4 7h8zM17 14l-4 8h8z"/>',
        'days-months.html': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 18h3M15 14h2"/>',
        'colors.html': '<path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 2-4 2 2 0 0 1 1.6-3.2H19a2 2 0 0 0 2-2A9 9 0 0 0 12 3Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="15" cy="7.5" r=".8"/><circle cx="17" cy="11" r=".8"/>',
        'body.html': '<circle cx="12" cy="4" r="2"/><path d="M12 6v9M7 10l5-3 5 3M5 14l7 1 7-1M12 15l-4 6M12 15l4 6"/>',
        'professions.html': '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13c5 3 13 3 18 0M10 13h4"/>',
        'transport.html': '<rect x="5" y="3" width="14" height="17" rx="3"/><path d="M5 10h14M5 16h14M8 20v2M16 20v2M8 13h1M15 13h1"/>',
        'seasons.html': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
        'drawing.html': '<path d="m14 6 4 4M20 4a3 3 0 0 0-4.2 0L7 13l4 4 9-9a3 3 0 0 0 0-4Z"/><path d="M7 13c-2-.6-3 1-3 3 0 1-.6 2-2 3 4 2 7 1 9-2"/>',
        'writing.html': '<path d="m14 5 5 5M4 20l5-.9L20 8a2.8 2.8 0 0 0-4-4L5 15zM3 23h18"/>',
        'writing-en.html': '<path d="M3 19 8 5l5 14M5 14h6M16 15c0-2 5-2 5 0v4h-5a2 2 0 0 1 0-4h5"/>',
        'games.html': '<path d="M6 8h12a4 4 0 0 1 3.8 3l1.1 6a3 3 0 0 1-4.4 3L15 18H9l-3.5 2a3 3 0 0 1-4.4-3l1.1-6A4 4 0 0 1 6 8Z"/><path d="M7 12v5M4.5 14.5h5M17 13h.01M20 15h.01"/>',
        'about.html': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
        'contact.html': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        'privacy.html': '<path d="M12 2 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/>',
        'terms.html': '<path d="M7 3h9l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M16 3v5h4M9 12h7M9 16h7"/>',
        'certificate.html': '<rect x="4" y="3" width="16" height="14" rx="2"/><path d="M8 8h8M8 12h5M9 17v5l3-2 3 2v-5"/>'
    };

    navLinks.querySelectorAll('a[href]').forEach((link) => {
        const filename = new URL(link.href, document.baseURI).pathname.split('/').pop().toLowerCase();
        const path = iconPaths[filename];
        if (!path || link.querySelector('.nav-link-icon')) return;

        const icon = document.createElement('span');
        icon.className = 'nav-link-icon';
        icon.setAttribute('aria-hidden', 'true');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.9');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.innerHTML = path;
        icon.appendChild(svg);
        link.classList.add('nav-link-item');
        link.prepend(icon);
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
