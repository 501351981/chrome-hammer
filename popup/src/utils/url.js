let router = null;
export function initRouter(r){
    router = r;
}

export function getPath(){
    let url = new URL(window.location.href);
    let path = url.origin + url.pathname;
    return path;
}

export function getFullUrl(routerPath){
    console.log('router',router);
    return getPath() + router.resolve({path: routerPath}).href
}