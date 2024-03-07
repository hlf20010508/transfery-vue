<script setup>
import { h, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { NPageHeader, NDataTable, NButton, NTime } from "naive-ui";
import jquery from "jquery";
import { messageBuffer } from "@/stores/message.js";
import { fingerprint } from "@/stores/admin.js";
import http from "@/http";

const router = useRouter();

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
        http.get("/deviceSignOut", { params: { fingerprint: row.fingerprint } }).then(res => {
            const data = res.data;
            if (data.success) {
                getDeviceData();
            }
        })
    },
});

let isLoading = ref(true);
let device = ref([]);

function getDeviceData() {
    http.get("/device").then(res => {
        const data = res.data;
        if (data.success) {
            device.value = data.device;
            isLoading.value = false;
        }
    });
}

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
});
</script>

<template>
    <n-page-header id="device-title-bar" @back="handleBack">
        <template #title>
            设备管理
        </template>
    </n-page-header>
    <n-data-table id="device-table" :columns="columns" :data="device" :bordered="false" :loading="isLoading"
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