(() => {
    'use strict';

    const shareButton = document.getElementById('shareSiteButton');
    const shareStatus = document.getElementById('shareStatus');
    if (!shareButton || !shareStatus) return;

    const siteUrl = 'https://imadtbn.github.io/Educational-Gaming/';
    const shareData = {
        title: 'أكاديمية المرح | تعلّم واكتشف',
        text: 'شارك أكاديمية المرح مع العائلة والأصدقاء: أنشطة وألعاب تعليمية ممتعة للأطفال.',
        url: siteUrl
    };
    let feedbackTimer;

    function showFeedback(message) {
        shareStatus.textContent = message;
        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(() => {
            shareStatus.textContent = '';
        }, 4500);
    }

    async function copySiteLink() {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(siteUrl);
                return true;
            } catch (_) {
                // Browser denied clipboard access: try the selection fallback.
            }
        }

        const field = document.createElement('textarea');
        field.value = siteUrl;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
        document.body.appendChild(field);
        field.select();

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_) {
            // Some browsers do not support the legacy copy command.
        }
        field.remove();
        return copied;
    }

    shareButton.addEventListener('click', async () => {
        if (typeof navigator.share === 'function') {
            try {
                await navigator.share(shareData);
                showFeedback('تمت مشاركة رابط الأكاديمية.');
                return;
            } catch (error) {
                // Dismissing the native share sheet is not an error.
                if (error && error.name === 'AbortError') return;
            }
        }

        if (await copySiteLink()) {
            showFeedback('تم نسخ الرابط! شاركه مع الأصدقاء.');
            return;
        }

        showFeedback('يمكنك نسخ رابط الأكاديمية من النافذة.');
        if (typeof window.prompt === 'function') {
            window.prompt('انسخ رابط الأكاديمية وشاركه مع الأصدقاء:', siteUrl);
        }
    });
})();
