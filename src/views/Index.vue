<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useSocketIO } from "@hlf01/vue3-socket.io";
import TitleBar from "@/components/TitleBar.vue";
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
import InputArea from "@/components/InputArea.vue";
import { updateMessageAreaHeight } from "@/hooks/message.js";
import {
    socketNewItem,
    socketProgress,
    socketRemoveItem,
    socketRemoveAll,
} from "@/hooks/socket.js";

onMounted(() => {
    updateMessageAreaHeight();
    // 监控可视区域大小
    window.visualViewport.addEventListener("resize", updateMessageAreaHeight);
});

onBeforeUnmount(() => window.visualViewport.removeEventListener("resize", updateMessageAreaHeight));

const socketIO = useSocketIO();

onMounted(() => {
    socketIO.subscribe("newItem", item => socketNewItem(item));
    socketIO.subscribe("progress", data => socketProgress(data));
    socketIO.subscribe("removeItem", id => socketRemoveItem(id));
    socketIO.subscribe("removeAll", socketRemoveAll);
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