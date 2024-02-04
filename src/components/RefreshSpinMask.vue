<script setup>
import { NSpin } from "naive-ui";
import { showRefreshSpin } from "@/stores/refresh.js"
</script>

<template>
    <n-spin :show="showRefreshSpin">
        <slot></slot>
    </n-spin>
</template>