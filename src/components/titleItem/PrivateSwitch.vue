<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NSwitch } from "naive-ui";
import { isAuthorized, isPrivate } from "@/stores/admin.js";
</script>

<template>
    <n-switch v-if="isAuthorized" v-model:value="isPrivate" size="small">
        <template #checked>
            私密
        </template>
        <template #unchecked>
            公开
        </template>
    </n-switch>
</template>

<style scoped>
.n-switch {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(100%, -50%);
    font-size: var(--min-font-size);
}
</style>