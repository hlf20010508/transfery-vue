<script setup>
import { NSpin } from "naive-ui";
import { showRefreshSpin } from "@/stores/refresh.js"
</script>

<template>
    <n-spin :show="showRefreshSpin">
        <slot></slot>
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