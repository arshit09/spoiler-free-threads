(function () {
    'use strict';

    let observer = null;
    let timeout = null;

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
        document.querySelectorAll('[style*="blur"], [style*="filter"]').forEach(element => {
            const parent = element.closest('[role="button"], [tabindex="0"]');
            if (parent && !parent.dataset.revealed && looksHidden(element)) {
                parent.click();
                parent.dataset.revealed = 'true';
            }
        });

        // Hidden/sensitive content by aria-label
        document.querySelectorAll('[aria-label*="Hidden"], [aria-label*="Sensitive"], [aria-label*="spoiler" i]').forEach(element => {
            if (!element.dataset.revealed) {
                element.click();
                element.dataset.revealed = 'true';
            }
        });

        // Buttons with spoiler-related text
        document.querySelectorAll('[role="button"], button').forEach(button => {
            const text = button.textContent?.toLowerCase() || '';
            if ((text.includes('spoiler') || text.includes('sensitive') || text.includes('tap to view') || text.includes('click to view')) && !button.dataset.revealed) {
                button.click();
                button.dataset.revealed = 'true';
            }
        });

        // Media containers with blurred content
        document.querySelectorAll('article div[role="button"]').forEach(container => {
            if (container.querySelector('[style*="blur"]') && !container.dataset.revealed) {
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
            clearTimeout(timeout);
            timeout = setTimeout(revealSpoilers, 500);
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
        clearTimeout(timeout);
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
