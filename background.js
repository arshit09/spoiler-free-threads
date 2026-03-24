function updateBadge(enabled) {
    chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({
        color: enabled ? '#4CAF50' : '#9E9E9E'
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({ enabled: true }, (result) => {
        updateBadge(result.enabled);
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get({ enabled: true }, (result) => {
        updateBadge(result.enabled);
    });
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        updateBadge(changes.enabled.newValue);
    }
});
