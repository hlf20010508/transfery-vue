<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted } from "vue";
import TitleBar from "@/components/TitleBar.vue";
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
import InputArea from "@/components/InputArea.vue";
import { updateMessageAreaHeight } from "@/hooks/message.js";

onMounted(() => {
    updateMessageAreaHeight();
    // 监控可视区域大小
    window.visualViewport.addEventListener("resize", updateMessageAreaHeight);
});
</script>

<template>
    <div>
        <TitleBar />
        <MessageArea />
        <ControlBar />
        <InputArea />
    </div>
</template>

<style scoped>
div {
    background: var(--background-color);
}
</style>