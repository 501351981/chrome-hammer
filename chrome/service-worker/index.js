(function () {
    'use strict';

    const defaultWebsites = {
        "singleUrls": [
            {
                "icon": "https://cn.vuejs.org/logo.svg",
                "id": "83d87bf0-6806-11ef-b561-d536b4d6e162",
                "title": "Vue",
                "url": "https://cn.vuejs.org/guide/introduction.html"
            },
            {
                "icon": "https://zh-hans.react.dev/favicon-32x32.png",
                "id": "65dbc990-6806-11ef-b561-d536b4d6e162",
                "title": "React",
                "url": "https://zh-hans.react.dev/learn"
            }
        ],
        "groups": [
            {
                "children": [
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "37506190-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Button",
                        "url": "https://element.eleme.io/#/zh-CN/component/button"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "48d7af90-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Layout布局",
                        "url": "https://element.eleme.io/#/zh-CN/component/layout"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "4f492930-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Icon",
                        "url": "https://element.eleme.io/#/zh-CN/component/icon"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "5fa14600-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Input",
                        "url": "https://element.eleme.io/#/zh-CN/component/input"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "6b711b90-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Select",
                        "url": "https://element.eleme.io/#/zh-CN/component/select"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "743d7520-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Date Picker",
                        "url": "https://element.eleme.io/#/zh-CN/component/date-picker"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "9e34dda0-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Form表单",
                        "url": "https://element.eleme.io/#/zh-CN/component/form"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "a1be2b70-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Table",
                        "url": "https://element.eleme.io/#/zh-CN/component/table"
                    },
                    {
                        "icon": "https://element.eleme.io/favicon.ico",
                        "id": "b3ee63a0-6a99-11ef-b97b-bb592d747c9d",
                        "title": "Dialog",
                        "url": "https://element.eleme.io/#/zh-CN/component/dialog"
                    }
                ],
                "id": "2e0a9240-6a99-11ef-b97b-bb592d747c9d",
                "name": "Element说明文档"
            },
            {
                "children": [
                    {
                        "icon": "https://v4.webpack.docschina.org/assets/favicon.ico",
                        "id": "81e77200-6861-11ef-a78d-076fedc92cea",
                        "title": "webpack4",
                        "url": "https://v4.webpack.docschina.org/concepts/"
                    },
                    {
                        "icon": "https://www.webpackjs.com/favicon.f326220248556af65f41.ico",
                        "id": "b0dc9fe0-6861-11ef-a78d-076fedc92cea",
                        "title": "webpack5",
                        "url": "https://www.webpackjs.com/concepts/"
                    },
                    {
                        "icon": "https://www.rollupjs.com/img/favicon.png",
                        "id": "030779c0-6862-11ef-8df9-6d797e36fb3f",
                        "title": "rollup",
                        "url": "https://www.rollupjs.com/"
                    }
                ],
                "id": "7a78aca0-6861-11ef-9ada-39a91532ad4f",
                "name": "前端技术"
            },
            {
                "children": [
                    {
                        "icon": "https://kubernetes.io/images/kubernetes.png",
                        "id": "40072d50-6fe9-11ef-8376-a99910617026",
                        "title": "k8s",
                        "url": "https://kubernetes.io/zh-cn/docs/home/"
                    }
                ],
                "id": "3ae34250-6fe9-11ef-8376-a99910617026",
                "name": "技术官网"
            }
        ]
    };

    chrome.runtime.onInstalled.addListener(({ reason }) => {
        if (reason === 'install') {
            console.log('感谢你安装有个锤子 installed');
            chrome.storage.local.set({favoriteWebsites: defaultWebsites});
        }
    });

})();
