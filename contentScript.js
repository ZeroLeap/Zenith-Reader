function modifyNodeText(node) {
    let words = node.split(' ');

    let result = words.map((word) => {
        // Check if the word contains a hyphen
        if (word.includes('-')) {
            // If it does, split it into parts, process each part individually, and then join them back together
            let hyphenatedParts = word.split('-').map((part) => {
                let boldLength = Math.round(part.length * 0.54);
                let boldPart = part.substring(0, boldLength);
                let regularPart = part.substring(boldLength);
                return `<b>${boldPart}</b>${regularPart}`;
            });
            // Join the processed parts back together with hyphens
            return hyphenatedParts.join('-');
        } else {
            let boldLength = Math.round(word.length * 0.54);
            let boldPart = word.substring(0, boldLength);
            let regularPart = word.substring(boldLength);
            return `<b>${boldPart}</b>${regularPart}`;
        }
    }).join(' ');

    return result;
}


function modifyTextNodes(node) {
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE') {
        return;
    }

    if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue)) {
        let modifiedText = modifyNodeText(node.nodeValue);
        let wrapper = document.createElement('span');
        wrapper.innerHTML = modifiedText;
        node.parentNode.replaceChild(wrapper, node);
    } else {
        for (let i = 0; i < node.childNodes.length; i++) {
            modifyTextNodes(node.childNodes[i]);
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'modify') {
        modifyTextNodes(document.body);

        // Count words and characters
        let bodyText = document.body.innerText;
        let wordCount = bodyText.split(/\s+/).length;
        let charCount = bodyText.length;

        // Instead of sending to popup.js, send it back to background.js
        sendResponse({ wordCount: wordCount, charCount: charCount });
    }
});
