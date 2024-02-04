<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NIcon } from "naive-ui";
</script>

<template>
    <n-icon size="34">
        <slot></slot>
    </n-icon>
</template>

<style scoped>
.n-icon {
    margin: 0 14px;
}
.n-icon:hover {
    cursor: pointer;
    color: var(--primary-color-hover);
}
</style>