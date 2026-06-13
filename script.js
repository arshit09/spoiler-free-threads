(function () {
    'use strict';

    let observer = null;
    let animationFrameId = null;

    function looksHidden(el) {
        const style = getComputedStyle(el);
        return style.filter.includes('blur') ||
            style.opacity === '0' ||
            style.visibility === 'hidden' ||
            el.getAttribute('aria-hidden') === 'true' ||
            !!el.closest('[aria-label*="Hidden"], [aria-label*="Sensitive"]');
    }

    function revealSpoilers() {
        // Elements with blur filters
        document.querySelectorAll('[style*="blur"]:not([data-blur-checked]), [style*="filter"]:not([data-blur-checked])').forEach(element => {
            element.dataset.blurChecked = 'true';
            const parent = element.closest('[role="button"], [tabindex="0"]');
            if (parent && !parent.dataset.revealed && looksHidden(element)) {
                parent.click();
                parent.dataset.revealed = 'true';
            }
        });

        // Hidden/sensitive content by aria-label
        document.querySelectorAll('[aria-label*="Hidden"]:not([data-revealed]), [aria-label*="Sensitive"]:not([data-revealed]), [aria-label*="spoiler" i]:not([data-revealed])').forEach(element => {
            element.click();
            element.dataset.revealed = 'true';
        });

        // Buttons with spoiler-related text
        document.querySelectorAll('[role="button"]:not([data-text-checked]), button:not([data-text-checked])').forEach(button => {
            const text = button.textContent?.toLowerCase() || '';
            if (text.trim().length > 0) {
                button.dataset.textChecked = 'true';
                if ((text.includes('spoiler') || text.includes('sensitive') || text.includes('tap to view') || text.includes('click to view')) && !button.dataset.revealed) {
                    button.click();
                    button.dataset.revealed = 'true';
                }
            }
        });

        // Media containers with blurred content
        document.querySelectorAll('article [style*="blur"]:not([data-media-blur-checked]), article [style*="filter"]:not([data-media-blur-checked])').forEach(blurEl => {
            blurEl.dataset.mediaBlurChecked = 'true';
            const container = blurEl.closest('div[role="button"]');
            if (container && !container.dataset.revealed) {
                container.click();
                container.dataset.revealed = 'true';
            }
        });
    }

    function start() {
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', start);
            return;
        }
        revealSpoilers();
        observer = new MutationObserver(() => {
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(() => {
                    revealSpoilers();
                    animationFrameId = null;
                });
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function stop() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Initialize based on stored state
    chrome.storage.local.get({ enabled: true }, (result) => {
        if (result.enabled) start();
    });

    // React to toggle changes from popup
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.enabled) {
            changes.enabled.newValue ? start() : stop();
        }
    });
})();
