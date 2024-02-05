<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NProgress } from "naive-ui";
import { getIcon } from 'material-file-icons';
import MessageItemBase from "./MessageItemBase.vue";

const props = defineProps(["item", "index"])

const svg = getIcon(props.item.content).svg;

function isComplete() {
    const item = props.item;
    if ("isComplete" in item && !item.isComplete) {
        return true;
    } else {
        return false;
    }
}
</script>

<template>
    <MessageItemBase :item="item" :index="index">
        <template #left>
            <div class="icon-container">
                <div v-html="svg"></div>
                <n-progress v-if="isComplete()" type="circle" :percentage="item.percentage">
                    <span class="percentage-span">{{ item.percentage }}%</span>
                </n-progress>
                <!-- <n-progress type="circle" :percentage="40">
                    <span class="percentage-span">%</span>
                </n-progress> -->
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
}</style>