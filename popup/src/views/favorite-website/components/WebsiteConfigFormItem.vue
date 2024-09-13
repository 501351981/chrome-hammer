<script setup>
import {createTab, sendTabMessage} from "../../../utils/tabs";
import {showLoading, closeLoading} from "../../../utils/message";
import {v1 as uuidV1} from 'uuid'
import {Plus, More, Download, SortUp, SortDown} from "@element-plus/icons-vue";
import WebsitePng from '../../../assets/website.png'

const props = defineProps({
    data:{
        type: Array,
        default: ()=>([])
    }
});


function newWebsite(){
    return {
        id: uuidV1(),
        title: '',
        url: '',
        icon: ''
    }
}
function addSingleUrl(){
    props.data.push(newWebsite())
}

async function getIcon(row){
    showLoading({text: '自动获取图标中'})
    let tab = await createTab(row.url, {active: false})
    sendTabMessage(tab.id, {
        type: 'getFavicon',
        url: row.url,
    },{
        delay: 1000,
        retry: 30
    }).then(res =>{
        if(res && res.favicon){
            row.icon = res.favicon;
        }
    }).finally(()=>{
        closeLoading();
    })

}
function deleteWebsite(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    if(index > -1){
        props.data.splice(index, 1)
    }
}

function insertBefore(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    if(index > -1){
        props.data.splice(index, 0, newWebsite())
    }else{
        props.data.unshift(newWebsite())
    }
}

function insertAfter(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    if(index> -1){
        if(index === props.data.length - 1){
            props.data.push(newWebsite())
        }else{
            props.data.splice(index + 1, 0, newWebsite())
        }
    }else{
        props.data.push(newWebsite())
    }
}

function top(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    let website = props.data.find(item => item.id === id);
    if(index > -1){
        props.data.splice(index, 1);
        props.data.unshift(website);
    }
}

function bottom(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    let website = props.data.find(item => item.id === id);
    if(index > -1){
        props.data.splice(index, 1);
        props.data.push(website);
    }
}

function up(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    let website = props.data.find(item => item.id === id);
    if(index > -1 && index > 0){
        props.data.splice(index, 1);
        props.data.splice(index - 1, 0, website);
    }
}

function down(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    let website = props.data.find(item => item.id === id);
    if(index > -1 && index < props.data.length - 1){
        props.data.splice(index, 1);
        props.data.splice(index + 1, 0, website);
    }
}
</script>

<template>
    <el-table :data="data" style="width: 100%">
        <el-table-column prop="title" label="名称" width="180" >
            <template #default="scope">
                <el-input v-model="scope.row.title" />
            </template>
        </el-table-column>
        <el-table-column prop="url" label="Url">
            <template #default="scope">
                <el-input v-model="scope.row.url"/>
            </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="360">
            <template #default="scope">
                <div class="website-icon">
                    <img :src="scope.row.icon || WebsitePng"/>
                    <el-input v-model="scope.row.icon"  class="input"/>
                    <el-button @click="getIcon(scope.row)" type="primary" link>获取图标地址</el-button>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="180">
            <template #default="scope">
                <el-icon :size="20" style="margin-left: 10px;cursor: pointer; transform: rotate(180deg)" title="置顶">
                    <Download @click="top(scope.row)"/>
                </el-icon>
                <el-icon :size="20" style="margin-left: 10px;cursor: pointer;" title="上移">
                    <SortUp @click="up(scope.row)"/>
                </el-icon>
                <el-icon :size="20" style="margin-left: 10px;cursor: pointer;" title="下移">
                    <SortDown @click="down(scope.row)"/>
                </el-icon>
                <el-icon :size="20" style="margin-left: 10px;cursor: pointer;" title="置底">
                    <Download @click="bottom(scope.row)"/>
                </el-icon>
                <el-popover trigger="click" appent-to-body>
                    <template #reference>
                        <el-icon :size="14" style="margin-left: 10px;">
                            <More/>
                        </el-icon>
                    </template>
                    <el-popconfirm title="确定删除?" @confirm="deleteWebsite(scope.row)">
                        <template #reference>
                            <div style="margin-bottom: 10px"><el-button type="primary" link>删除</el-button></div>
                        </template>
                    </el-popconfirm>
                    <div style="margin-bottom: 10px"><el-button @click="insertBefore(scope.row)" type="primary" link>上方插入</el-button></div>
                    <div><el-button @click="insertAfter(scope.row)" type="primary" link>下方插入</el-button></div>
                </el-popover>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-website" @click="addSingleUrl">
        <el-icon :size="14">
            <Plus/>
        </el-icon>
        <span style="margin-left: 4px;">添加</span>
    </div>
</template>

<style scoped lang=less>
.website-icon {
    display: flex;
    align-items: center;
    img {
        width: 20px;
        height: 20px;
        margin-right: 6px;
    }
    .input {
        flex: 1;
        margin-right: 6px;
    }
}

.add-website {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--border-color);
    margin: 10px 0;
    height: 30px;
    cursor: pointer;
}
</style>