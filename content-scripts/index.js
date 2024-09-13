import {getFavicon} from "./utils";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type){
        case 'getFavicon':
            let favicon = getFavicon();
            sendResponse({
                favicon
            })
            break;
        default:
            break;
    }

})