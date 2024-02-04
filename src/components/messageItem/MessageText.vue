<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import MessageItemBase from "./MessageItemBase.vue";

defineProps(["item"]);

function messageCopyText(content) {
    navigator.clipboard.writeText(content.trim());
}
</script>

<template>
    <MessageItemBase :item="item" v-bind="$attrs">
        <div @click="messageCopyText(item.content)">
            <p v-for="(contentItem, contentIndex) in item.content.trim().split('\n')" :key="'contentList' + contentIndex">
                {{ contentItem }}
            </p>
        </div>
    </MessageItemBase>
</template>

<style scoped>
p {
    font-size: 16px;
    overflow-wrap: break-word;
    word-break: break-word;
    min-height: 22px;
    margin: 8px 0;
    text-align: left;
}

p:hover {
    cursor: pointer;
}
</style>