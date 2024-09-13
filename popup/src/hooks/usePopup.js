/*
* 判断插件是通过popup展示 还是全屏单独页面展示
* popup为true代表在浏览器工具栏中打开
* popup为false代表单独页面打开
*/
import {ref} from 'vue';
import {getCurrentTab} from "../utils/tabs";

const popup = ref(true)
function usePopup(){
    getCurrentTab().then(tab=>{
        if(tab){
            popup.value = false
        }
    })

    return {
        popup
    }
}

export default usePopup;