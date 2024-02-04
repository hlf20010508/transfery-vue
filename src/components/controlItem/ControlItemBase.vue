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