window.onload = function() {
    const modifyButton = document.getElementById("modifyButton");

    if (modifyButton) {
        modifyButton.addEventListener("click", modifyOrReload);
    }

    displayCounts();
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key];
        if (key === 'wordCount' || key === 'charCount') {
            displayCounts();
        }
    }
});

function displayCounts() {
    chrome.storage.local.get(['wordCount', 'charCount'], function(data) {
        document.getElementById('wordCount').textContent = "Word Count: " + (data.wordCount || 0);
        document.getElementById('charCount').textContent = "Char Count: " + (data.charCount || 0);
    });
}

function modifyOrReload() {
    const modifyButton = document.getElementById("modifyButton");

    if (modifyButton.textContent === "Modify Text") {
        modifyButton.textContent = "Refresh Page";
        chrome.runtime.sendMessage({action: "modify"});
    } else {
        modifyButton.textContent = "Modify Text";
        chrome.runtime.sendMessage({action: "reload"});
    }
}
