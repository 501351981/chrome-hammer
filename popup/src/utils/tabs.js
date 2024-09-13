import {getPath} from "./url";

export async function getCurrentTab(){
    let currentTab = await chrome.tabs.getCurrent();
    return currentTab;

}
export async function getTargetTab(){
    let currentTab = await chrome.tabs.getCurrent();
    if(currentTab){
        return currentTab;
    }

    let tabs = await chrome.tabs.query({});
    let path = getPath();
    let tab = tabs.find(tab => tab.url.includes(path));
    return tab;
}


export async function toTab(tab, url, options={}){
    await chrome.tabs.update(tab.id, {
        active: true,
        url: url,
        ...options
    });
    await chrome.windows.update(tab.windowId, { focused: true });
}

export async function createTab(url, options={}){
    let tab = await chrome.tabs.create({
        active: true,
        url,
        ...options
    });
    return tab;
}

const defaultOptions = {
    retry: 0,
    delay: 1000,
    duration: 500
};
export function sendTabMessage(tabId, message, options={}) {
    let {retry, delay, duration} = {...defaultOptions, ...options}
    return new Promise((resolve, reject) => {
        let haveTry = 0;
        let sendMessage = () => {
            chrome.tabs.sendMessage(tabId, message, (res) => {
                if (chrome.runtime.lastError) {
                    console.error("发送消息失败:", chrome.runtime.lastError.message);
                    if(haveTry++ < retry){
                        console.log(`发送消息失败，${duration} ms后重试`)
                        setTimeout(sendMessage, duration)
                    }else{
                        reject(chrome.runtime.lastError);
                    }
                }else{
                    resolve(res);
                }
            });
        };
        if(delay > 0){
            setTimeout(sendMessage, delay);
        }else{
            sendMessage();
        }
    });
}