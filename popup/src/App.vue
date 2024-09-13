<script setup>
import Layout from "./Layout.vue";
import { useRouter } from 'vue-router'
import {initRouter} from "./utils/url";
import {getLatestRoutePathFromStorage} from "./utils/storage";

const router = useRouter()
initRouter(router);

getLatestRoutePathFromStorage().then(fullPath =>{
    console.log('fullPath', fullPath)
    let configPaths =['/favorite-website-config']
    if (fullPath && !configPaths.includes(fullPath)){
        router.push({
            path: fullPath
        })
    }
})
</script>

<template>
  <Layout>

  </Layout>
</template>

<style scoped>


</style>
