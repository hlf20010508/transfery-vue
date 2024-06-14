<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { h, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { NPageHeader, NDataTable, NButton, NTime } from "naive-ui";
import jquery from "jquery";
import { useSocketIO } from "@hlf01/vue3-socket.io";
import { messageBuffer } from "@/stores/message.js";
import { fingerprint, isDeviceLoading, deviceList } from "@/stores/admin.js";
import { getDeviceData } from "@/hooks/admin.js";
import http from "@/http";
import { socket } from "@/socket";

const router = useRouter();
const socketIO = useSocketIO();

function handleBack() {
    messageBuffer.value = {};
    router.push({ name: "index" });
}

const createColumns = ({ signOut }) => {
    return [
        {
            title: "设备",
            key: "browser",
        },
        {
            title: "上次登录时间",
            key: "lastUseTimestamp",
            render(row) {
                return h(
                    NTime,
                    {
                        time: row.lastUseTimestamp,
                        format: "yyyy-MM-dd HH:mm:ss"
                    },
                );
            }
        },
        {
            key: "signOut",
            render(row) {
                if (row.fingerprint === fingerprint) {
                    return h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: "small",
                            disabled: true,
                        },
                        { default: () => "本机" }
                    );
                }
                return h(
                    NButton,
                    {
                        strong: true,
                        tertiary: true,
                        size: "small",
                        onClick: () => signOut(row)
                    },
                    { default: () => "退出" }
                );
            }
        }
    ];
};

const columns = createColumns({
    signOut(row) {
        http.post("/deviceSignOut", {
            fingerprint: row.fingerprint,
            sid: socket.id
        }).then(() => {
            getDeviceData();
        })
    },
});

let maxHeight = ref(0);
function updateDeviceTableHeight() {
    const visualHeight = window.visualViewport.height;
    const deviceTitleBarHeight = jquery("#device-title-bar").outerHeight(true);
    const deviceTableTitleBarHeight = jquery(".n-data-table-base-table-header").outerHeight(true);
    const deviceTableContentHeight = visualHeight - deviceTitleBarHeight - deviceTableTitleBarHeight;
    maxHeight.value = deviceTableContentHeight;
}

onMounted(() => {
    updateDeviceTableHeight();
    window.visualViewport.addEventListener("resize", updateDeviceTableHeight);

    getDeviceData();

    socketIO.subscribe('device', getDeviceData);
});

onBeforeUnmount(() => window.visualViewport.removeEventListener("resize", updateDeviceTableHeight));
</script>

<template>
    <n-page-header id="device-title-bar" @back="handleBack">
        <template #title>
            设备管理
        </template>
    </n-page-header>
    <n-data-table id="device-table" :columns="columns" :data="deviceList" :bordered="false" :loading="isDeviceLoading"
        :max-height="maxHeight" />
</template>

<style scoped>
.n-page-header-wrapper {
    margin: 10px;
}

#device-table {
    margin: 0 10px;
    width: auto;
}

#device-table :deep(.n-data-table__pagination) {
    margin-bottom: 10px;
}
</style>