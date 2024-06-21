chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "modify") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "modify"}, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else if (response) {
                    chrome.storage.local.set({ wordCount: response.wordCount || 0, charCount: response.charCount || 0 });
                }
            });
        });
    } else if (request.action === "reload") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    }
    sendResponse();
});
