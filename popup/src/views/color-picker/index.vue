<script setup>
import {ref, reactive, watch, onMounted, onBeforeUnmount} from 'vue';
import {showLoading, closeLoading, showToast} from "../../utils/message";
import {writeTextToClipboard} from "../../utils/clipboard";

let canvasWrapper = ref(null);
let canvas = ref(null);
let canvas2d = null;
let imageDom = ref(null);
let width = ref(null);
let height = ref(null);

let tableData = reactive([
    {
        label: '鼠标所在位置颜色',
        colors: []
    },
    {
        label: '鼠标点击位置颜色',
        colors: []
    },
    {
        label: '主色调',
        colors: [
            {
                rgb: 'rgb(10, 20, 30)',
                hex: '#0a141b'
            },
            {
                rgb: 'rgb(10, 20, 30)',
                hex: '#bac41b'
            }
        ]
    },
]);

function readClipboard() {
    navigator.clipboard.read().then(function (result) {
        for (let i = 0; i < result.length; i++) {
            let types = result[i].types;
            for (let j = 0; j < types.length; j++) {
                if (types[j].startsWith('image')) {
                    result[i].getType(types[j]).then(data => {
                        let reader = new FileReader();
                        reader.onload = function (event) {
                            const img = new Image();
                            img.src = event.target.result;
                            img.onload = function () {
                                imageDom.value = img;
                            };
                        };
                        reader.readAsDataURL(data);
                    });
                    return;
                }
            }
        }
    }).catch(e => {
        console.log(e);
    });
}

function beforeUpload(event) {
    let reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            imageDom.value = img;
            console.log('img 新突破', img)
        };

    };
    reader.readAsDataURL(event);
    return false;
}

function drawImage(img) {
    let canvasWidth = width.value;
    let canvasHeight = height.value;
    let scaleFactor = Math.min(canvasWidth / img.width, canvasHeight / img.height);

    let scaledWidth = img.width * scaleFactor;
    let scaledHeight = img.height * scaleFactor;

    let x = (canvasWidth - scaledWidth) / 2;
    let y = (canvasHeight - scaledHeight) / 2;

    canvas2d.clearRect(0, 0, canvasWidth, canvasHeight);
    canvas2d.drawImage(img, 0, 0, img.width, img.height,
        x, y, scaledWidth, scaledHeight);
}

function getMostCommonColors() {
    const numColors = 10;
    const ctx = canvas2d;
    const imageData = ctx.getImageData(0, 0, width.value, height.value);
    const data = imageData.data;
    const colorCount = {};

    // 遍历像素数据
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 250 && g > 250 && b > 250 || r < 5 && g < 5 && b < 5) {
            continue;
        }
        const key = `${r},${g},${b}`;
        if (!colorCount[key]) {
            colorCount[key] = 0;
        }
        colorCount[key]++;
    }

    // 将颜色计数转换为数组并排序
    const colors = Object.keys(colorCount).map(key => {
        let rgb = key.split(',').map(Number);
        return {
            rgb: rgb,
            hex: rgbToHex(...rgb),
            count: colorCount[key]
        };
    });
    colors.sort((a, b) => b.count - a.count);

    let result = [];

    for (let i = 0; i < colors.length; i++) {
        if (result.length >= numColors) {
            break;
        }
        if (result.find(item => diffColor(item, colors[i]) <= 30)) {
            continue;
        }
        result.push(colors[i]);
    }

    tableData[2].colors = result.map(item => ({
        rgb: `rgb(${item.rgb[0]}, ${item.rgb[1]}, ${item.rgb[2]})`,
        hex: item.hex
    }));
}

function diffColor(source, target) {
    return Math.max(Math.abs(source.rgb[0] - target.rgb[0]), Math.abs(source.rgb[1] - target.rgb[1]), Math.abs(source.rgb[2] - target.rgb[2]));
}

function rgbToHex(r, g, b) {
    // 确保输入在0-255之间
    r = Math.floor(Math.max(Math.min(r, 255), 0));
    g = Math.floor(Math.max(Math.min(g, 255), 0));
    b = Math.floor(Math.max(Math.min(b, 255), 0));

    // 转换为16进制并填充前导零
    let hexR = r.toString(16).padStart(2, '0');
    let hexG = g.toString(16).padStart(2, '0');
    let hexB = b.toString(16).padStart(2, '0');

    // 拼接结果
    return `#${hexR}${hexG}${hexB}`;
}

watch(imageDom, () => {
    showLoading('提取中');
    setTimeout(()=>{
        clearColors();
        drawImage(imageDom.value);
        getMostCommonColors();
        closeLoading();
    })
});

function clearColors(){
    tableData[0].colors = []
    tableData[1].colors = []
    tableData[2].colors = []
}
onMounted(() => {
    console.dir(canvasWrapper);
    width.value = canvasWrapper.value.offsetWidth - 2;
    height.value = canvasWrapper.value.offsetHeight - 2;

    canvas2d = canvas.value.getContext('2d');
    document.addEventListener('keydown', listenKeyDown);
});
onBeforeUnmount(()=>{
    document.removeEventListener('keydown', listenKeyDown)
})
function listenKeyDown(event){
    console.log(event)
    if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
        readClipboard();
    }
}

function mousemove(event){
    const pixelData = getPixel(event);
    tableData[0].colors = [
        {
            rgb: `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`,
            hex: rgbToHex(pixelData[0], pixelData[1], pixelData[2])
        }
    ]
}

function clickCanvas(event){
    const pixelData = getPixel(event);
    tableData[1].colors.push({
        rgb: `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`,
        hex: rgbToHex(pixelData[0], pixelData[1], pixelData[2])
    })
}

function getPixel(event){
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // 检查坐标是否在画布范围内
    if (mouseX < 0 || mouseX >= canvas.width || mouseY < 0 || mouseY >= canvas.height) {
        return; // 坐标超出画布范围
    }

    // 获取该坐标的像素数据
    const imageData = canvas2d.getImageData(mouseX, mouseY, 1, 1);
    return  imageData.data;
}

function copy(text){
    writeTextToClipboard(text);
    showToast('复制成功')
}
</script>

<template>
    <div class="color-picker-wrapper">
        <div class="import-area">
            <el-button type="primary" size="small" @click="readClipboard">从剪切板读取</el-button>
            <el-upload :limit="1"
                       accept="image/*"
                       :show-file-list="false"
                       :before-upload="beforeUpload"
            >
                <el-button type="primary" size="small" style="margin-left: 10px">上传图片</el-button>
            </el-upload>
        </div>
        <div class="canvas-wrapper" ref="canvasWrapper">
            <canvas :style="{width: width + 'px', height: height+'px'}"
                    :width="width"
                    :height="height"
                    ref="canvas"
                    @mousemove="mousemove"
                    @click="clickCanvas"
            ></canvas>
            <div v-if="!imageDom" class="placeholder">粘贴（Ctrl/Command + V）或上传一张图片</div>
        </div>
        <div v-if="imageDom" class="color-result">
            <el-table :data="tableData" :show-header="false" :border="true">
                <el-table-column prop="label" label="类型" width="140"/>
                <el-table-column prop="colors" label="颜色">
                    <template #default="scope">
                        <div v-for="item in scope.row.colors" class="main-color-item">
                            <div :style="{backgroundColor: item.hex}" class="color-block"></div>
                            <div class="color-value">
                                <div @click="copy(item.hex)">{{ item.hex }}</div>
                                <div  @click="copy(item.rgb)">{{ item.rgb }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>


        </div>
    </div>
</template>

<style scoped lang=less>
.color-picker-wrapper {
    padding: 10px;
    .import-area {
        margin-bottom: 10px;
    }
}

.import-area {
    display: flex;
}

.canvas-wrapper {
    width: 100%;
    height: 250px;
    border: 1px solid var(--border-color);
    position: relative;
    .placeholder {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        white-space: nowrap;
    }
}

.color-result {
    margin-top: 10px;

    .main-color-item {
        display: flex;
        align-items: center;

        & + .main-color-item {
            margin-top: 10px;
        }

        .color-block {
            width: 100px;
            height: 30px;
        }

        .color-value {
            margin-left: 10px;
            flex: 1;

            > div {
                height: 20px;
                line-height: 20px;
                cursor: pointer;
            }
        }
    }
}
</style>