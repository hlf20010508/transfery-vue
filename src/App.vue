<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { NConfigProvider, NSpin, NMessageProvider } from "naive-ui";
import { useSocketIO } from "@hlf01/vue3-socket.io";
import { showRefreshSpin } from "@/stores/refresh.js";
import {
    socketConnect,
    socketConnectionNumber,
    socketSignOut,
    socketLeaveRoom
} from "@/hooks/socket.js";
import { auto_login } from "@/hooks/admin.js"
import { isDemo } from "@/utils";

/** @type import('naive-ui').GlobalThemeOverrides */
const customTheme = {
    common: {
        primaryColor: '#409eff',
        primaryColorHover: '#409eff',
    },
}

if (!isDemo()) {
    onBeforeMount(async () => await auto_login());

    const socketIO = useSocketIO();

    onMounted(() => {
        socketIO.subscribe("connect", socketConnect);
        socketIO.subscribe("connectionNumber", number => socketConnectionNumber(number));
        socketIO.subscribe("signOut", fingerprint => socketSignOut(fingerprint));
    });

    onBeforeUnmount(socketLeaveRoom);
}
</script>

<template>
    <n-config-provider :theme-overrides="customTheme">
        <n-spin :show="showRefreshSpin">
            <n-message-provider>
                <router-view />
            </n-message-provider>
        </n-spin>
    </n-config-provider>
</template>

<style>
:root {
    --primary-color: #409eff;
    --primary-color-hover: #409eff;
    --error-color: #f56c6c;
    --error-color-hover: #f56c6c;
    --background-color: #f3f3f3;
    --min-font-size: 12px;
    --hint-color: #aaa;
}

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    max-width: 600px;
    margin: 0 auto 0 auto;
}

html,
body {
    margin: 0;
    height: 100%;
    overflow: hidden;
}

.n-config-provider {
    height: 100%;
}

.n-spin-container {
    height: 100%;
    /* 防止顶部无法占满 */
    overflow: hidden;
}

.n-spin-content {
    height: 100%;
}
</style>