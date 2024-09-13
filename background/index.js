import {defaultWebsites} from "./config.js";
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        console.log('感谢你安装有个锤子 installed');
        chrome.storage.local.set({favoriteWebsites: defaultWebsites});
    }
});