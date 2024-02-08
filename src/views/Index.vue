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
} from "@/hooks/socket.js";
import { useSocketIO } from "@hlf01/vue3-socket.io";

const socketIO = useSocketIO();

onMounted(() => {
    updateMessageAreaHeight();
    window.addEventListener("resize", updateMessageAreaHeight);

    socketIO.subscribe("connect", socketConnect);
    socketIO.subscribe("newItem", item => socketNewItem(item));
    socketIO.subscribe("progress", data => socketProgress(data));
    socketIO.subscribe("removeItem", id => socketRemoveItem(id));
    socketIO.subscribe("removeAll", socketRemoveAll);
});
</script>

<template>
    <Wrapper>
        <TitleBar id="title-bar" />
        <MessageArea id="message-area" />
        <ControlBar id="control-bar" />
        <InputArea id="input-area" />
    </Wrapper>
</template>