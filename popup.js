const toggle = document.getElementById('toggle');
const status = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');
const refreshHint = document.getElementById('refreshHint');

function updateStatus(enabled) {
    status.textContent = enabled ? 'Enabled' : 'Disabled';
    status.className = enabled ? 'status active' : 'status';
}

function showRefresh() {
    refreshBtn.classList.add('visible');
    refreshHint.classList.add('visible');
}

chrome.storage.local.get({ enabled: true }, (result) => {
    toggle.checked = result.enabled;
    updateStatus(result.enabled);
});

toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked });
    updateStatus(toggle.checked);
    showRefresh();
});

refreshBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) chrome.tabs.reload(tabs[0].id);
        window.close();
    });
});
