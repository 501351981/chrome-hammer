import { ElLoading, ElMessage } from 'element-plus'
let loadingInstance = null;

export function showLoading(options) {
    loadingInstance = ElLoading.service(options)
}

export function closeLoading() {
    loadingInstance && loadingInstance.close()
}

export function showToast(msg, type="success", options={}){
    let duration = 3000;
    if(msg.length > 10){
        duration = Math.ceil(msg.length / 3) * 1000;
        duration = Math.min(duration, 60000);
    }
    ElMessage({
        message: msg,
        type: type,
        duration: duration,
        ...options
    })
}