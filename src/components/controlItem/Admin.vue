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

const options = [
    {
        label: "设备",
        key: "device"
    },
    {
        label: "授权",
        key: "token"
    },
    {
        label: "退出",
        key: "quit"
    },
];

function quit() {
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

function manageDevice() {
    router.push({ name: 'device' });
}

function manageToken() { }

function handleSelect(key) {
    switch(key) {
        case "device":
            manageDevice();
            break;
        case "token":
            manageToken();
            break;
        case "quit":
            quit();
            break;
        default:
            return;
    }
}
</script>

<template>
    <ControlItemBase>
        <n-dropdown v-if="isAuthorized" trigger="click" :options="options" @select="handleSelect" placement="top">
            <User />
        </n-dropdown>
        <User v-else @click="router.push({ name: 'login' })" />
    </ControlItemBase>
</template>