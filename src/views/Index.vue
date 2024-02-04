<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted } from "vue";
import Wrapper from "@/components/Wrapper.vue";
import TimeBar from "@/components/TimeBar.vue";
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
import InputArea from "@/components/InputArea.vue";
import { updateMessageAreaHeight } from "@/hooks/message.js";

onMounted(() => {
    updateMessageAreaHeight();
    window.addEventListener("resize", updateMessageAreaHeight);
});
</script>

<template>
    <Wrapper>
        <TimeBar id="time-bar" />
        <MessageArea id="message-area" />
        <ControlBar id="control-bar" />
        <InputArea id="input-area" />
    </Wrapper>
</template>