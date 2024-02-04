<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NCard, NTime } from "naive-ui";
import MessageItemBase from "./MessageItemBase.vue";

defineProps(["item", "index"]);

function messageCopyText(content) {
    navigator.clipboard.writeText(content.trim());
}
</script>

<template>
    <MessageItemBase :item="item" :index="index">
        <n-card @click="messageCopyText(item.content)" embedded :bordered="false" footer-style="text-align: right;">
            <p v-for="(paragraph, paragraphIndex) in item.content.split('\n')" :key="'paragraph' + paragraphIndex">
                {{ paragraph }}
            </p>
            <template #footer>
                <n-time :time="item.time" format="HH:mm:ss" />
            </template>
        </n-card>
    </MessageItemBase>
</template>

<style scoped>
p {
    font-size: 16px;
    overflow-wrap: break-word;
    word-break: break-word;
    min-height: 22px;
    margin: 8px 0;
}

p:hover {
    cursor: pointer;
}
</style>