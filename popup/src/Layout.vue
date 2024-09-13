<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import usePopup from "./hooks/usePopup";
let router = useRouter();
function toPage(path){
    router.push(path);
}

const {popup} = usePopup();

</script>

<template>
<div class="layout" :class="{popup: popup}">
    <div class="content">
        <router-view></router-view>
    </div>
    <div class="menu">
        <div class="menu-item" @click="toPage('/favorite-website')">常用网站</div>
        <div class="menu-item" @click="toPage('/json-parse')">JSON解析</div>
        <div class="menu-item" @click="toPage('/color-picker')">颜色提取</div>
    </div>
</div>
</template>



<style scoped lang="less">
.layout {
    display: flex;
    height: 100vh;
    width: 100%;
    min-height: 500px;
    &.popup {
        width: 540px;
    }
    .menu {
        border-left: 1px solid var(--border-color);
        padding: 0 10px;
    }
    .menu-item {
        white-space: nowrap;
        text-align: right;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
    }
    .content {
        flex: 1;
        min-width: 200px;
        margin-right: 10px;
        overflow-y: auto;
    }
}
</style>