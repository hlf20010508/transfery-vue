<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted } from "vue";
import Wrapper from "@/components/Wrapper.vue";
import TitleBar from "@/components/TitleBar.vue";
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
import InputArea from "@/components/InputArea.vue";
import { updateMessageAreaHeight } from "@/hooks/message.js";
import {
    socketConnect,
    socketNewItem,
    socketProgress,
    socketRemoveItem,
    socketRemoveAll,
    socketConnectionNumber,
} from "@/hooks/socket.js";
import { useSocketIO } from "@hlf01/vue3-socket.io";

const socketIO = useSocketIO();

onMounted(() => {
    updateMessageAreaHeight();
    // 监控可视区域大小
    window.visualViewport.addEventListener("resize", updateMessageAreaHeight);

    socketIO.subscribe("connect", socketConnect);
    socketIO.subscribe("newItem", item => socketNewItem(item));
    socketIO.subscribe("progress", data => socketProgress(data));
    socketIO.subscribe("removeItem", id => socketRemoveItem(id));
    socketIO.subscribe("removeAll", socketRemoveAll);
    socketIO.subscribe("connectionNumber", number => socketConnectionNumber(number));
});
</script>

<template>
    <Wrapper>
        <TitleBar />
        <MessageArea />
        <ControlBar />
        <InputArea />
    </Wrapper>
</template>