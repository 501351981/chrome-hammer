(function () {
    'use strict';

    function getFavicon(){
        let dom = document.querySelector('head link[type="image/x-icon"]');
        if(dom && dom.href){
            return dom.href;
        }

        dom = document.querySelector('head link[rel="shortcut icon"]');
        if (dom && dom.href){
            return dom.href;
        }

        const links = document.head.getElementsByTagName('link');
        for (const link of links) {
            if (link.rel === 'icon' || link.href && link.href.endsWith('favicon.ico')) {
                return link.href;
            }
        }
        return null;
    }

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        switch (message.type){
            case 'getFavicon':
                let favicon = getFavicon();
                sendResponse({
                    favicon
                });
                break;
        }

    });

})();
