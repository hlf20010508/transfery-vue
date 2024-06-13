<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { NPageHeader, NButton, NTime, NList, NListItem, NThing, NTag, NModal, NForm, NFormItem, NInput, NSelect, NCard, NEllipsis, NEmpty, useMessage } from "naive-ui";
import jquery from "jquery";
import { useSocketIO } from "@hlf01/vue3-socket.io";
import { messageBuffer } from "@/stores/message.js";
import { copyText } from "@/utils";
import { getCurrentTimeStamp } from "@/utils"
import http from "@/http";

let showModal = ref(false);

let formValue = ref({
    name: '',
    expiration: null,
});

let formRef = ref();

const rules = {
    name: {
        required: true,
        message: '请输入名称',
    },
    expiration: {
        required: true,
        message: '请选择有效期',
    }
}

let expirationOptions = [
    {
        label: "1天",
        value: 3600 * 24 * 1000,
    },
    {
        label: "7天",
        value: 3600 * 24 * 7 * 1000,
    },
    {
        label: "30天",
        value: 3600 * 24 * 30 * 1000,
    },
    {
        label: "90天",
        value: 3600 * 24 * 90 * 1000,
    },
    {
        label: "180天",
        value: 3600 * 24 * 180 * 1000,
    },
    {
        label: "365天",
        value: 3600 * 24 * 365 * 1000,
    },
    {
        label: "长期",
        value: 3600 * 24 * 365 * 100 * 1000,
    },
]

const message = useMessage();
const messageConfig = {
    closable: true,
    duration: 1500,
};

function handleCopy(content) {
    copyText(content);
    message.success("复制成功！", messageConfig);
}

let tokens = ref([]);

const router = useRouter();

function handleBack() {
    messageBuffer.value = {};
    router.push({ name: "index" });
}

function updateTokenListHeight() {
    const visualHeight = window.visualViewport.height;
    const tokenTitleBarHeight = jquery("#token-title-bar").outerHeight(true);
    const tokenListHeight = visualHeight - tokenTitleBarHeight;
    jquery("#token-list").outerHeight(tokenListHeight);
}

async function validateForm() {
    try {
        await formRef.value.validate();

        return true;
    } catch (errors) {
        for (let error of errors)
            console.error(error[0].message);

        return false;
    }
}

async function createToken(e) {
    e.preventDefault();

    const isValid = await validateForm();

    if (!isValid)
        return;

    let data = {
        name: formValue.value.name,
        expirationTimestamp: getCurrentTimeStamp() + formValue.value.expiration,
    };

    http.post("/createToken", data).then(() => {
        getToken();
        showModal.value = false;
    });
}

function getToken() {
    http.get("/getToken").then((res) => {
        tokens.value = res.data;
    })
}

function removeToken(token) {
    http.post("/removeToken", { token }).then(() => {
        getToken();
    });
}

const socketIO = useSocketIO();

onMounted(() => {
    socketIO.subscribe("token", getToken);

    updateTokenListHeight();
    window.visualViewport.addEventListener("resize", updateTokenListHeight);
    getToken();
});

onBeforeUnmount(() => window.visualViewport.removeEventListener("resize", updateTokenListHeight));
</script>

<template>
    <n-page-header id="token-title-bar" @back="handleBack">
        <template #title>
            授权管理
        </template>
        <template #extra v-if="tokens.length !== 0">
            <n-button @click="showModal = true" strong type="primary">新建</n-button>
        </template>
    </n-page-header>
    <n-empty v-if="tokens.length === 0" description="暂无授权">
        <template #extra>
            <n-button @click="showModal = true" strong type="primary">新建</n-button>
        </template>
    </n-empty>
    <n-list id="token-list">
        <n-list-item v-for="(item, index) in tokens" :key="'token-list-item' + index">
            <template #suffix>
                <n-button class="token-remove-button" @click="removeToken(item.token)" strong secondary
                    type="error">注销</n-button>
            </template>
            <n-thing :title="item.name">
                <template #description>
                    <n-tag :bordered="false" type="info" size="small">
                        上次使用时间：
                        <n-time :time="item.lastUseTimestamp" format="yyyy-MM-dd"></n-time>
                    </n-tag>
                    <n-tag :bordered="false" type="warning" size="small">
                        到期时间：
                        <n-time :time="item.expirationTimestamp" format="yyyy-MM-dd"></n-time>
                    </n-tag>
                </template>
                <div @click="handleCopy(item.token)">
                    <n-ellipsis class="token-ellipsis" :tooltip="false">
                        {{ item.token }}
                    </n-ellipsis>
                </div>
            </n-thing>
        </n-list-item>
    </n-list>
    <n-modal v-model:show="showModal" :mask-closable="false">
        <n-card class="token-form-card">
            <n-form ref="formRef" :model="formValue" :rules="rules">
                <n-form-item label="名称" path="name">
                    <n-input v-model:value="formValue.name" placeholder="输入名称" />
                </n-form-item>
                <n-form-item label="有效期" path="expiration">
                    <n-select v-model:value="formValue.expiration" :options="expirationOptions"
                        placeholder="选择有效期"></n-select>
                </n-form-item>
                <n-form-item>
                    <n-button attr-type="button" @click="createToken" strong type="primary">生成</n-button>
                    <n-button class="token-form-cancel-button" @click="showModal = false" strong secondary
                        type="error">取消</n-button>
                </n-form-item>
            </n-form>
        </n-card>
    </n-modal>
</template>

<style scoped>
.n-page-header-wrapper {
    margin: 10px;
}

#token-list {
    overflow: auto;
}

.token-remove-button {
    margin-right: 10px;
}

.token-form-card {
    max-width: 400px;
}

.token-form-cancel-button {
    margin-left: 10px;
}

.n-ellipsis:hover {
    cursor: pointer;
    color: var(--primary-color-hover);
}

.n-ellipsis {
    max-width: 240px;
}
</style>