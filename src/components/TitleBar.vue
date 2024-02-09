<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { connectionNumber } from "@/stores/connection.js";
</script>

<template>
    <div id="title-bar">
        Transfery
        <div class="connection-number">
            <span v-if="connectionNumber > 0">在线人数：{{ connectionNumber }}</span>
            <span v-else>连接中</span>
        </div>
    </div>
</template>

<style scoped>
#title-bar {
    margin-top: 10px;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
}

.connection-number {
    font-size: var(--min-font-size);
    color: var(--tip-color);
}
</style>