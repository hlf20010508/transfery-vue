<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { connectionNumber } from "@/stores/connection.js";
import { isDemo } from "@/utils";

const hint = isDemo() ? "Demo模式" : "连接中";
</script>

<template>
    <div class="connection-number">
        <span v-if="connectionNumber > 0">在线设备：{{ connectionNumber }}</span>
        <span v-else>{{ hint }}</span>
    </div>
</template>

<style scoped>
.connection-number {
    font-size: var(--min-font-size);
    color: var(--hint-color);
}
</style>