<script setup>
import {v1 as uuidV1} from 'uuid'
import WebsiteConfigFormItem from './WebsiteConfigFormItem.vue'
import {Plus, More, Download, SortUp, SortDown} from "@element-plus/icons-vue";

const props = defineProps({
    data: {
        type: Array,
        default: ()=>([])
    }
})

function newGroup(){
    return {
        id: uuidV1(),
        name: '',
        children: []
    }
}
function addGroup(){
    props.data.push(newGroup())
}

function cancelBubble(e){
    console.log(e);
    e.cancelBubble = true;

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
        props.data.splice(index, 0, newGroup())
    }else{
        props.data.unshift(newGroup())
    }
}

function insertAfter(row){
    let id = row.id;
    let index = props.data.findIndex(item => item.id === id);
    if(index> -1){
        if(index === props.data.length - 1){
            props.data.push(newGroup())
        }else{
            props.data.splice(index + 1, 0, newGroup())
        }
    }else{
        props.data.push(newGroup())
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
   <div v-if="data.length">
       <div  v-for="group in data"
             :key="group.id"
             class="collapse-item"
       >
           <div class="collapse-item-title">
               <el-input v-model="group.name"
                         style="width: 200px; font-weight: bold"
                         placeholder="分组名"
                         @click.stop
                         @keydown.stop
                         @keyup.stop
               />
               <div class="operate">
                   <el-icon :size="20" style="margin-left: 10px;cursor: pointer; transform: rotate(180deg)" title="置顶">
                       <Download @click="top(group)"/>
                   </el-icon>
                   <el-icon :size="20" style="margin-left: 10px;cursor: pointer;" title="上移">
                       <SortUp @click="up(group)"/>
                   </el-icon>
                   <el-icon :size="20" style="margin-left: 10px;cursor: pointer;" title="下移">
                       <SortDown @click="down(group)"/>
                   </el-icon>
                   <el-icon :size="20" style="margin-left: 10px;cursor: pointer;" title="置底">
                       <Download @click="bottom(group)"/>
                   </el-icon>
                   <el-popover trigger="click">
                       <template #reference>
                           <el-icon :size="14" style="margin-left: 10px;">
                               <More/>
                           </el-icon>
                       </template>
                       <el-popconfirm title="确定删除?" @confirm="deleteWebsite(group)">
                           <template #reference>
                               <div style="margin-bottom: 10px"><el-button type="primary" link>删除</el-button></div>
                           </template>
                       </el-popconfirm>
                       <div style="margin-bottom: 10px"><el-button @click="insertBefore(group)" type="primary" link>上方插入</el-button></div>
                       <div><el-button @click="insertAfter(group)" type="primary" link>下方插入</el-button></div>
                   </el-popover>
               </div>
           </div>
           <WebsiteConfigFormItem v-model:data="group.children"/>
       </div>
   </div>
    <div class="add-group" @click="addGroup">
        <el-icon :size="14">
            <Plus/>
        </el-icon>
        <span style="margin-left: 4px;">添加分组</span>
    </div>
</template>

<style scoped lang=less>
.add-group {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--border-color);
    margin: 10px 0;
    height: 30px;
    cursor: pointer;
}

.collapse-item {

    .collapse-item-title {
        background: #ddd;
        padding: 10px 20px 10px 10px;
        display: flex;
        justify-content: space-between;
        color: #000;
    }
    + .collapse-item{
        margin-top: 10px;
    }
    .operate{
        display: flex;
        align-items: center;
    }
}
</style>