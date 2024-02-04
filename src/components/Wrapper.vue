<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NSpin, NMessageProvider } from "naive-ui";
import { showRefreshSpin } from "@/stores/refresh.js"
</script>

<template>
    <n-spin :show="showRefreshSpin">
        <n-message-provider>
            <slot></slot>
        </n-message-provider>
    </n-spin>
</template>

<style scoped>
.n-spin-container {
    height: 100%;
    margin: 0;
}

:deep(.n-spin-content) {
    height: 100%;
    margin: 0;
    /* 防止顶部无法占满 */
    overflow: hidden;
}
</style>