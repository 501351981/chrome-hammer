import { createWebHashHistory, createRouter } from 'vue-router'
import FavoriteWebsite from "./views/favorite-website/index.vue";
import FavoriteWebsiteConfig from "./views/favorite-website/config.vue";
import CodeGenerate from "./views/code-generate/index.vue"
import JsonParse from "./views/json-parse/index.vue"
import ColorPicker from "./views/color-picker/index.vue";
import {setLatestRoutePathToStorage} from "./utils/storage";

const routes = [
    { path: '/', component: FavoriteWebsite },
    { path: '/favorite-website', component: FavoriteWebsite },
    { path: '/favorite-website-config', component: FavoriteWebsiteConfig },
    { path: '/code-generate', component: CodeGenerate },
    { path: '/json-parse', component: JsonParse },
    { path: '/color-picker', component: ColorPicker },
]

let router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) =>{

    setLatestRoutePathToStorage(to.fullPath);
    next();
})
export default router;
