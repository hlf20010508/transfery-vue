<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted } from "vue";
import jquery from "jquery";
import RefreshSpinMask from "@/components/RefreshSpinMask.vue";
import TimeBar from "@/components/TimeBar.vue";
import MessageArea from "@/components/MessageArea.vue";
import ControlBar from "@/components/ControlBar.vue";
import InputArea from "@/components/InputArea.vue";

function updateMessageAreaHeight() {
    let htmlHeight = jquery("html").outerHeight();
    let timeBarHeight = jquery("#time-bar").outerHeight();
    let controlBarHeight = jquery("#control-bar").outerHeight();
    let inputAreaHeight = jquery("#input-area").outerHeight();
    jquery("#message-area").outerHeight(htmlHeight - timeBarHeight - controlBarHeight - inputAreaHeight - 21);
}

onMounted(() => {
    updateMessageAreaHeight();
    window.addEventListener("resize", updateMessageAreaHeight);
});
</script>

<template>
    <RefreshSpinMask>
        <TimeBar id="time-bar" />
        <MessageArea id="message-area" />
        <ControlBar id="control-bar" />
        <InputArea id="input-area" />
    </RefreshSpinMask>
</template>