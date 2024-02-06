<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref, onMounted } from "vue";
import { NProgress, NIcon } from "naive-ui";
import { getIcon } from 'material-file-icons';
import { VideoPause, VideoPlay } from "@element-plus/icons-vue";
import { Play, Pause } from "@vicons/ionicons5";
import jquery from "jquery";
import MessageItemBase from "./MessageItemBase.vue";

const props = defineProps(["messageList", "index"])

const item = props.messageList[props.index];

const svg = getIcon(item.content).svg;

function isComplete() {
    if ("isComplete" in item && !item.isComplete) {
        return true;
    } else {
        return false;
    }
}

let isIconHovered = ref(false);

onMounted(() => {
    jquery("#progress-div-" + props.index).on("mouseenter", () => {
        console.log("mouseenter", "pause:", item.pause)
        if (!item.pause) {
            isIconHovered.value = true;
        }
    });
    jquery("#progress-div-" + props.index).on("mouseleave", () => {
        console.log("mouseleave", "pause:", item.pause)
        if (!item.pause) {
            isIconHovered.value = false;
        }
    });
})
</script>

<template>
    <MessageItemBase :messageList="messageList" :index="index">
        <template #left>
            <div class="icon-container">
                <div v-html="svg"></div>
                <div :id="'progress-div-' + index" class="progress-div">
                    <!-- <n-progress v-if="isComplete()" type="circle" :percentage="item.percentage">
                        <span class="percentage-span">{{ item.percentage }}%</span>
                    </n-progress> -->
                    <n-progress type="circle" :percentage="40">
                        <span v-show="!item.pause && !isIconHovered" class="percentage-span">%</span>
                        <n-icon v-show="!item.pause && isIconHovered" size="34" color="white">
                            <Pause />
                        </n-icon>
                        <n-icon v-show="item.pause" size="34" color="white">
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