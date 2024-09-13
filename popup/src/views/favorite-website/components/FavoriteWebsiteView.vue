<script setup>
import {ref} from 'vue'
import {Folder} from "@element-plus/icons-vue";
const props = defineProps({
    favoriteSingles: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    columnCount:{
        type: Number,
        default: 4
    }
});

function openUrl(url){
    chrome.tabs.create({active: true, url: url})
}
</script>
<template>
    <div class="favorite-single" :style="{'--column-count': columnCount}">
        <div class="favorite-single-item" v-for="(item, index) in favoriteSingles" :key="index">
            <a @click="openUrl(item.url)"></a>
            <div class="tile-icon">
                <img :src="item.icon" />
            </div>
            <div class="tile-title title-ltr">
                <span>{{item.title}}</span>
            </div>
        </div>
    </div>
    <div class="groups">
       <el-popover v-for="group in groups"
                   :key="group.id"
                   :width="220"
                   trigger="click"
       >
           <template #reference>
               <div class="group-item">
                   <el-icon :size="14">
                       <Folder />
                   </el-icon>
                   <span style="margin-left: 4px">{{group.name}}</span>
               </div>
           </template>
           <div class="group-children" >
               <a v-for="item in group.children" :key="item.id" @click="openUrl(item.url)">
                   <img :src="item.icon" />
                   <span class="title">{{item.title}}</span>
               </a>
           </div>
       </el-popover>
    </div>
</template>

<style scoped lang="less">
.favorite-single{
    --content-width: calc(var(--column-count) * var(--title-size) + 1px);
    width: calc(var(--content-width) + 12px);
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    padding: 2px;
    .favorite-single-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        width: var(--title-size);
        height: var(--title-size);
        opacity: 1;
        position: relative;

        &:hover{
            background: var(--title-hover-color);
        }

        a {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .tile-icon {
            align-items: center;
            background-color: var(--title-background-color);
            border-radius: 50%;
            display: flex;
            flex-shrink: 0;
            height: var(--icon-size);
            justify-content: center;
            margin-top: 16px;
            width: var(--icon-size);
            img {
                height: 24px;
                width: 24px;
            }
        }
        .tile-title {
            align-items: center;
            border-radius: calc(var(--title-height) / 2 + 2px);
            color: var(--text-color);
            display: flex;
            height: var(--title-height);
            line-height: calc(var(--title-height)/ 2);
            margin-top: 6px;
            padding: 2px 8px;
            width: 88px;
            span {
                font-weight: 400;
                overflow: hidden;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
            }
        }
    }
}

.groups {
    display: flex;
    flex-wrap: wrap;
    .group-item {
        margin: 4px 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

}

.group-children{
    max-height: 220px;
    overflow-y: auto;

    a {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
            width: 16px;
            height: 16px;
        }
        .title {
            margin-left: 4px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>