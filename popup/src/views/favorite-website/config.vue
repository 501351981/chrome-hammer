<script setup>
import {onMounted, reactive, watch} from "vue";
import {
    getFavoriteWebsitesFromStorage,
    setFavoriteWebsitesToStorage
} from "../../utils/storage";
import WebsiteConfigFormItem from './components/WebsiteConfigFormItem.vue'
import WebsiteGroupConfig from './components/WebsiteGroupConfig.vue'
import {Share, Upload} from "@element-plus/icons-vue";
import {showToast} from "../../utils/message";

const state = reactive({
    singleUrls: [],
    groups: []
})

onMounted(()=>{
    getFavoriteWebsitesFromStorage().then(res =>{
        state.singleUrls = res.singleUrls || [];
        state.groups = res.groups || [];
        console.log('res', res)
    })
})



watch(state, ()=>{
    setFavoriteWebsitesToStorage({
        singleUrls: state.singleUrls.filter(item => item.title && item.url),
        groups: state.groups.filter(group => group.name).map(group => ({
            id: group.id,
            name: group.name,
            children: group.children.filter(item => item.title && item.url)
        }))
    });
})

function downloadJSON() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'text/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `锤子-常用网站-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function importJSON(json){
    let singleUrls = json.singleUrls || [];
    let groups = json.groups || [];
    let mergedSingleUrls = [...state.singleUrls]
    let mergedGroups = [...state.groups];

    mergeWebsite(mergedSingleUrls, singleUrls);
    groups.forEach(groupItem => {
        let mergeGroupItem = mergedGroups.find(mergeGroupItem => mergeGroupItem.name === groupItem.name)
        if(mergeGroupItem){
            mergeWebsite(mergeGroupItem.children, groupItem.children);
        }else{
            mergedGroups.push(groupItem)
        }
    })
    state.singleUrls = mergedSingleUrls;
    state.groups = mergedGroups;
}

function mergeWebsite(target, source){
    source.forEach(sourceItem =>{
        if(!target.find(targetItem => targetItem.title === sourceItem.title && targetItem.url === sourceItem.url)){
            target.push(sourceItem);
        }
    })
}

function beforeUpload(file){
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
       try {
          let json = JSON.parse(content);
          if(json.hasOwnProperty('singleUrls') || json.hasOwnProperty('groups')){
              importJSON(json);
          }else{
              showToast('文件格式错误，必须包含singleUrls、groups字段', 'error');
          }
       }catch (e){
           console.log(e)
           showToast('文件格式错误，必须为JSON', 'error');
       }
    };
    reader.onerror = function(e) {
        showToast('文件读取失败', 'error');
    };
    reader.readAsText(file);
    return false;
}
</script>

<template>
    <div class="favorite-website-config">
        <div style="display: flex; justify-content: flex-end; align-items: center">
            <el-icon size="16" title="分享/备份/下载" style="cursor:pointer;"
                     @click="downloadJSON"
            >
                <Share/>
            </el-icon>
            <el-upload :show-file-list="false" :limit="1"  accept=".json"
                       :before-upload="beforeUpload"
            >
                <el-icon size="16" title="导入" @click="importJSON">
                    <Upload />
                </el-icon>
            </el-upload>

        </div>
        <div class="title">单一网站配置</div>
        <div class="content-wrapper">
            <WebsiteConfigFormItem v-model:data="state.singleUrls"/>
        </div>
        <div class="title">网站组配置</div>
        <div class="content-wrapper">
            <WebsiteGroupConfig v-model:data="state.groups"/>
        </div>
    </div>

</template>

<style scoped lang=less>
.title {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 10px 10px;
}

.content-wrapper {
    padding: 0 20px 20px 20px;
}
</style>