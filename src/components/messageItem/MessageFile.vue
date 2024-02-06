<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref, onMounted, watch } from "vue";
import { NProgress, NIcon } from "naive-ui";
import { getIcon } from 'material-file-icons';
import { Play, Pause } from "@vicons/ionicons5";
import jquery from "jquery";
import MessageItemBase from "./MessageItemBase.vue";
import { pauseUpload, resumeUpload } from "@/hooks/upload.js"
import http from "@/http";

const props = defineProps(["messageList", "index"])

const item = props.messageList[props.index];

const svg = getIcon(item.content).svg;

let isIconHovered = ref(false);

onMounted(() => {
    jquery("#progress-div-" + props.index).on("mouseenter", () => {
        if (!item.pause) {
            isIconHovered.value = true;
        }
    });
    jquery("#progress-div-" + props.index).on("mouseleave", () => {
        if (!item.pause) {
            isIconHovered.value = false;
        }
    });
})

// 上传完成后关闭监听
watch(() => item.isComplete, (newValue) => {
    if (newValue) {
        jquery("#progress-div-" + props.index).off("mouseenter");
        jquery("#progress-div-" + props.index).off("mouseleave");
    }
});

function download() {
    console.log("download: ", item.fileName);
    http
        .get("/downloadUrl", { params: { fileName: item.fileName } })
        .then(res => {
            let data = res.data;
            if (data.success) {
                window.open(data.url, '_blank');
            }
        });
}
</script>

<template>
    <MessageItemBase :messageList="messageList" :index="index">
        <template #left>
            <div class="icon-container">
                <div v-html="svg" @click="download"></div>
                <div v-if="!item.isComplete" :id="'progress-div-' + index" class="progress-div">
                    <n-progress type="circle" :percentage="item.percentage">
                        <span v-show="!item.pause && !isIconHovered" class="percentage-span">{{ item.percentage }}%</span>
                        <n-icon v-show="!item.pause && isIconHovered" @click="pauseUpload(item.id)" size="34" color="white">
                            <Pause />
                        </n-icon>
                        <n-icon v-show="item.pause" @click="resumeUpload(item.id)" size="34" color="white">
                            <Play />
                        </n-icon>
                    </n-progress>
                </div>
            </div>
        </template>
        <template #container>
            <p>{{ item.content }}</p>
        </template>
    </MessageItemBase>
</template>

<style scoped>
.icon-container {
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;
    /* 防止flex布局下因右侧内容过多而导致图标被挤压 */
    flex-shrink: 0;
}

.progress-div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.n-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
}

.percentage-span {
    text-align: center;
    font-size: 1px;
    color: white;
}
</style>