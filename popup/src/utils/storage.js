export async function getFavoriteWebsitesFromStorage(){
    let result = await chrome.storage.local.get(["favoriteWebsites"]);
    if(!result.favoriteWebsites){
        return {
            singleUrls: [],
            groups: []
        }
    }

    return result.favoriteWebsites;
}

export async function setFavoriteWebsitesToStorage(favoriteWebsites){
    await chrome.storage.local.set({favoriteWebsites: JSON.parse(JSON.stringify(favoriteWebsites))});
}

export async function setJSONToStorage(json){
    await chrome.storage.local.set({json: json});
}

export async function getJSONFromStorage(){
    let result = await chrome.storage.local.get(["json"]);
    if(!result.json){
        return "{\n  \"description\": \"请输入JSON\"\n}"
    }
    return result.json
}

export async function setLatestRoutePathToStorage(fullPath){
    await chrome.storage.local.set({latestRoutePath: fullPath});
}

export async function getLatestRoutePathFromStorage(){
    let result = await chrome.storage.local.get(["latestRoutePath"]);
    if(!result.latestRoutePath){
        return undefined
    }
    return result.latestRoutePath;
}

export async function clearLatestRoutePathStorage(){
    await chrome.storage.local.remove('latestRoutePath');
}