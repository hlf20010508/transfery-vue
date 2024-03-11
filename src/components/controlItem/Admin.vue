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
import { isAuthorized, fingerprint } from "@/stores/admin.js"
import { signOut } from "@/hooks/admin.js"
import http from "@/http";
import { socket } from "@/socket";

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
    http.post("/deviceSignOut", {
        fingerprint,
        sid: socket.id
    }).then(res => {
        const data = res.data;
        if (data.success) {
            signOut();

            message.success("退出成功");
            console.log("退出成功");
        }
    });
}

function manageDevice() {
    router.push({ name: 'device' });
}

function manageToken() { }

function handleSelect(key) {
    switch (key) {
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