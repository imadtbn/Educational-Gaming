function setupNavbar() {
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('header .nav');

    if(!nav || !navLinks) return;

    // Create Hamburger
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    nav.insertBefore(hamburger, navLinks);

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    // Create Close Button inside navLinks
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-menu';
    closeBtn.innerHTML = '✖';
    navLinks.insertBefore(closeBtn, navLinks.firstChild);

    function toggleMenu() {
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

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
