<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { User } from "@element-plus/icons-vue";
import { NDropdown, useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import ControlItemBase from "./ControlItemBase.vue";
import { isAuthorized, isPrivate } from "@/stores/admin.js"
import { messageBuffer, infiniteLoadingReset } from "@/stores/message.js"
import { socketJoinRoom, socketLeaveRoom } from "@/hooks/socket.js"

const router = useRouter();
const message = useMessage();

const options = [{
    label: "退出",
    key: "quit"
}];

function handleSelect(key) {
    if (key === "quit") {
        socketLeaveRoom();
        isAuthorized.value = false;
        socketJoinRoom();

        isPrivate.value = false;

        localStorage.clear();
        messageBuffer.value = {};

        infiniteLoadingReset.value = !infiniteLoadingReset.value;

        message.success("退出成功");
        console.log("退出成功");
    }
}
</script>

<template>
    <ControlItemBase>
        <n-dropdown v-if="isAuthorized" trigger="click" :options="options" @select="handleSelect">
            <User />
        </n-dropdown>
        <User v-else @click="router.push({ name: 'login' })" />
    </ControlItemBase>
</template>