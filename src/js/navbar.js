function setupNavbar() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.style.fontSize = '2rem';
    hamburger.style.cursor = 'pointer';
    hamburger.style.color = 'var(--color-primary)';

    // Hide hamburger by default (desktop)
    hamburger.style.display = 'none';

    // Insert hamburger into nav
    const nav = document.querySelector('nav');
    if(nav && navLinks) {
        nav.insertBefore(hamburger, navLinks);

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Adjust path based on current location (root vs html folder)
        const swPath = window.location.pathname.includes('/html/') ? '../sw.js' : 'sw.js';
        navigator.serviceWorker.register(swPath).catch(err => {
          console.log('SW registration failed: ', err);
        });
      });
    }
}

document.addEventListener('DOMContentLoaded', setupNavbar);
