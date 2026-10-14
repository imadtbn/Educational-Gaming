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
    }

    getStars() {
        return this.stars;
    }

    renderStarsBadge() {
        const headerContainer = document.querySelector('header .container.nav');
        if (!headerContainer || document.getElementById('stars-badge')) return;

        const badge = document.createElement('a');
        badge.id = 'stars-badge';
        badge.href = window.location.pathname.includes('/html/')
            ? 'certificate.html'
            : 'html/certificate.html';
        badge.title = 'رصيد النجوم وشهادة الإنجاز';
        badge.setAttribute('aria-label', `رصيدك ${this.stars} نجمة، عرض شهادة الإنجاز`);
        badge.innerHTML = `<span class="stars-icon" aria-hidden="true">⭐</span><span id="stars-count">${this.stars}</span>`;
        headerContainer.appendChild(badge);
    }

    updateBadge() {
        const countSpan = document.getElementById('stars-count');
        if (countSpan) {
            countSpan.textContent = this.stars;
            const badge = document.getElementById('stars-badge');
            badge.setAttribute('aria-label', `رصيدك ${this.stars} نجمة، عرض شهادة الإنجاز`);
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

window.rewards = new RewardsSystem();
