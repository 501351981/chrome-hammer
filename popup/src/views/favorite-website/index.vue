<template>
    <div class="favorite-website" ref="domRef" :style="{'--title-size': titleSize}">
      <div class="content-area">
          <FavoriteWebsiteView
              :favorite-singles="favoriteSingles"
              :groups="groups"
              :column-count="columnCount"
          />
      </div>
        <div class="operation-buttons">
            <el-icon :size="20" title="配置">
                <Tools @click="toEdit" style="cursor: pointer;"/>
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import {Tools} from '@element-plus/icons-vue'
import FavoriteWebsiteView from './components/FavoriteWebsiteView.vue'
import {ref, onMounted} from 'vue'
import {getTargetTab, toTab, createTab} from "../../utils/tabs";
import {getFullUrl} from "../../utils/url";
import {getFavoriteWebsitesFromStorage, clearLatestRoutePathStorage} from "../../utils/storage";
const mode = ref('view');

const domRef = ref(null);
const titleSize = ref('112px')
const columnCount = ref(4)

async function toEdit() {
    await clearLatestRoutePathStorage();
    let targetTab = await getTargetTab();
    if(targetTab) {
        toTab(targetTab, getFullUrl('/favorite-website-config'))
    }else{
        createTab(getFullUrl('/favorite-website-config'))
    }
}

const favoriteSingles = ref([]);
const groups = ref([]);

onMounted(() => {
    getFavoriteWebsitesFromStorage().then(res => {
        favoriteSingles.value = res.singleUrls || [];
        groups.value = res.groups || [];
    });

    let offsetWidth = domRef.value.offsetWidth;
    let count = Math.floor(offsetWidth / 112);
    let size = Math.floor(offsetWidth / count);
    columnCount.value = count;
    titleSize.value = size + 'px';
})
</script>

<style scoped lang="less">
.favorite-website {
    width: 100%;
    height: 100%;
    position: relative;
    min-width: 330px;
    --icon-size: 48px;
    --title-background-color: rgba(68, 71, 70, 1.00);
    --title-height: 32px;
    --title-hover-color: rgba(255, 255, 255, .1);
    overflow: hidden;
    .content-area {
        height: 100%;
        overflow-y: auto;
    }
    .operation-buttons {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
</style>