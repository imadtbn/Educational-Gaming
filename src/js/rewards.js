
// Audio context setup for sound effects
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSuccessSound() {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

function playErrorSound() {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function fireConfetti() {
    // Dynamically load confetti if not present
    if (typeof confetti === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        script.onload = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        };
        document.head.appendChild(script);
    } else {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

class RewardsSystem {
    constructor() {
        this.stars = parseInt(localStorage.getItem('fun_academy_stars')) || 0;
        this.init();
    }

    init() {
        this.renderStarsBadge();
    }

    addStars(amount) {
        this.stars += amount;
        localStorage.setItem('fun_academy_stars', this.stars);
        this.updateBadge();
        this.showAnimation(amount);
        playSuccessSound();
        fireConfetti();
    }

    getStars() {
        return this.stars;
    }

    renderStarsBadge() {
        const headerContainer = document.querySelector('header .container.nav');
        if (!headerContainer) return;

        const badge = document.createElement('div');
        badge.id = 'stars-badge';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.gap = '8px';
        badge.style.backgroundColor = 'var(--color-accent)';
        badge.style.color = '#fff';
        badge.style.padding = '5px 15px';
        badge.style.borderRadius = '20px';
        badge.style.fontWeight = 'bold';
        badge.style.cursor = 'pointer';
        badge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        badge.style.width = 'fit-content';

        // Link to certificates if stars >= 50
        badge.onclick = () => {
            const isRoot = !window.location.pathname.includes('/html/');
            window.location.href = isRoot ? 'html/certificate.html' : 'certificate.html';
        };

        badge.innerHTML = `<span style="font-size: 1.2rem;">⭐</span> <span id="stars-count">${this.stars}</span>`;

        // Insert after nav-links or before hamburger
        headerContainer.appendChild(badge);
    }

    updateBadge() {
        const countSpan = document.getElementById('stars-count');
        if (countSpan) {
            countSpan.textContent = this.stars;
            const badge = document.getElementById('stars-badge');
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }
    }

    showAnimation(amount) {
        const popup = document.createElement('div');
        popup.textContent = `+${amount} ⭐`;
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.fontSize = '3rem';
        popup.style.fontWeight = 'bold';
        popup.style.color = 'var(--color-accent)';
        popup.style.textShadow = '0 4px 8px rgba(0,0,0,0.2)';
        popup.style.zIndex = '9999';
        popup.style.animation = 'floatUp 1.5s ease-out forwards';

        if (!document.querySelector('#reward-styles')) {
            const style = document.createElement('style');
            style.id = 'reward-styles';
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 0; transform: translate(-50%, -30%); }
                    20% { opacity: 1; transform: translate(-50%, -50%); }
                    80% { opacity: 1; transform: translate(-50%, -60%); }
                    100% { opacity: 0; transform: translate(-50%, -80%); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1500);
    }
}


window.playErrorSound = playErrorSound;
window.rewards = new RewardsSystem();
