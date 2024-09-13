<script setup>
import {ref, onMounted, watch, nextTick} from 'vue';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import {FullScreen} from "@element-plus/icons-vue";
import usePopup from "../../hooks/usePopup";
import {getJSONFromStorage, setJSONToStorage} from "../../utils/storage";
import {createTab, getTargetTab, toTab} from "../../utils/tabs";
import {getFullUrl} from "../../utils/url";
const {popup} = usePopup();

const editorRef1 = ref(null);
const editorRef2 = ref(null);
let editor1 = null;
let editor2 = null;

let json = {a:1}
const editor1Options = {
    mode: 'code',
    modes: ['code', 'form', 'tree'],
    onChangeText: edit1Change
}

const editor2Options = {
    mode: 'form',
    modes: ['form', 'code', 'tree'],
    onChangeText: edit2Change
}
function edit1Change(jsonString){
    setJSONToStorage(jsonString)
    console.log('edit1Change', jsonString)
    editor2 && editor2.updateText(jsonString)
}
function edit2Change(jsonString){
    try {
        editor1 && editor1.set(JSON.parse(jsonString))
    }catch (e){

    }
}
watch(popup, (val)=>{
    if(!val){
       nextTick(()=>{
           editor2 = new JSONEditor(editorRef2.value, editor2Options)
           console.log('editor1.getText()', editor1.getText())
           editor2.updateText(editor1.getText())
       })
    }
})
onMounted(()=>{
    editor1 = new JSONEditor(editorRef1.value, editor1Options)
    getJSONFromStorage().then(res=>{
        editor1.setText(res);
        editor2 && editor2.updateText(res)
    })
    if(!popup.value){
        nextTick(()=>{
            editor2 = new JSONEditor(editorRef2.value, editor2Options)
            editor2.updateText(editor1.getText())
        })
    }
})

async function fullScreen(){
    let targetTab = await getTargetTab();
    if(targetTab) {
        toTab(targetTab, getFullUrl('/json-parse'))
    }else{
        createTab(getFullUrl('/json-parse'))
    }
}
</script>

<template>
    <div class="json-parse">
        <div ref="editorRef1" class="json-editor"></div>
        <div v-if="!popup" ref="editorRef2" class="json-editor"></div>
        <el-icon
            v-if="popup"
            :size="16"
            color="gray"
            class="full-screen"
            @click="fullScreen"
        >
            <FullScreen/>
        </el-icon>
    </div>
</template>

<style scoped lang="less">
.json-parse {
    height: 100%;
    display: flex;
    position: relative;
    .json-editor {
        height: 100%;
        flex: 1;
        & + .json-editor {
            margin-left: 20px;
        }
    }
    ::v-deep .jsoneditor {
        border: none;
    }
    ::v-deep .jsoneditor-poweredBy {
        display: none !important;
    }

    ::v-deep .jsoneditor-outer{
        background: var(--brand-color);
    }
    .full-screen{
        position: absolute;
        cursor: pointer;
        right: 10px;
        bottom: 5px;
    }
}
</style>