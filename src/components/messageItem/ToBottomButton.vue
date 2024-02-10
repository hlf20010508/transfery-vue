<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NIcon, NFlex } from "naive-ui";
import { ArrowDownCircleOutline } from "@vicons/ionicons5";
import { messageAreaScrollToBottom } from "@/hooks/message.js"
import { newMessageNumber, showToBottomButton } from "@/stores/message.js"
</script>

<template>
    <n-flex v-show="showToBottomButton" class="to-bottom-wrap" vertical align="center">
        <n-icon size="34" class="to-bottom" @click="messageAreaScrollToBottom">
            <arrow-down-circle-outline />
        </n-icon>
        <div v-show="newMessageNumber > 0" class="new-message-number">{{ newMessageNumber }}</div>
    </n-flex>
</template>

<style scoped>
.new-message-number {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    background: var(--primary-color);
    font-size: var(--min-font-size);
    text-align: center;
    color: white;
    position: absolute;
    top: -6px;
}

.to-bottom-wrap {
    display: inline-block;
    width: 34px;
    margin: 0;
    position: absolute;
    bottom: 10px;
    right: 40px;
}

.to-bottom {
    border-radius: 50%;
    background: var(--background-color);
}

.to-bottom:hover {
    color: var(--primary-color);
    cursor: pointer;
}
</style>