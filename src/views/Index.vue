<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NDivider } from "naive-ui";
import RefreshSpinMask from "@/components/RefreshSpinMask.vue";
import TimeBar from "@/components/TimeBar.vue";
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
</script>

<template>
    <RefreshSpinMask>
        <TimeBar />
        <MessageArea />
        <n-divider style="--n-color: #dcdfe6" />
        <ControlBar />
    </RefreshSpinMask>
</template>

<style scoped>
.n-divider {
    margin: 0 0 10px 0;
}
</style>