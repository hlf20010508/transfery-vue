<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { NForm, NFormItem, NCheckbox, NInput, NButton, NFlex, useMessage } from "naive-ui";
import http from "@/http";
import { isAuthorized, fingerprint, browser } from "@/stores/admin.js";
import { messageBuffer } from "@/stores/message.js";
import { socketJoinRoom } from "@/hooks/socket.js";
import { socket } from "@/socket"

let authData = reactive({
    username: "",
    password: "",
    rememberMe: false,
    fingerprint,
    browser,
    sid: socket.id
});

const rules = {
    username: {
        required: true,
        message: '请输入用户名',
    },
    password: {
        required: true,
        message: '请输入密码',
    }
}

const loginForm = ref();

async function validateForm() {
    try {
        await loginForm.value.validate();

        return true;
    } catch (errors) {
        for (let error of errors)
            console.error(error[0].message);

        return false;
    }
}

const message = useMessage();
const router = useRouter();

async function auth(e) {
    e.preventDefault();

    const isValid = await validateForm();

    if (!isValid)
        return;

    const messageReactive = message.loading("登录中...", { duration: 0 });

    http.post("/auth", authData).then(res => {
        const data = res.data;
        if (data.success) {
            localStorage.setItem('certificate', data.certificate);

            messageReactive.destroy();
            messageBuffer.value = {};

            isAuthorized.value = true;
            socketJoinRoom();

            message.success("登录成功");
            console.log("登录成功");

            router.push({ name: 'index' });
        } else {
            messageReactive.destroy();

            message.error("登录失败");
            console.error("登录失败");
        }
    });
}
</script>

<template>
    <n-flex justify="center" vertical>
        <h1>登录</h1>
        <n-form ref="loginForm" :model="authData" :rules="rules">
            <n-form-item label="用户名" path="username">
                <n-input v-model:value="authData.username" placeholder=""></n-input>
            </n-form-item>
            <n-form-item label="密码" path="password">
                <n-input v-model:value="authData.password" placeholder="" type="password"></n-input>
            </n-form-item>
            <n-form-item class="no-title" path="rememberMe">
                <n-checkbox v-model:checked="authData.rememberMe" />
                <span>自动登录</span>
            </n-form-item>
            <n-form-item class="no-title">
                <n-button attr-type="button" type="primary" @click="auth">登录</n-button>
            </n-form-item>
        </n-form>
    </n-flex>
</template>

<style scoped>
.n-flex {
    height: 100%;
}

h1 {
    text-align: center;
}

.n-form {
    width: 50%;
    margin: 0 auto;
}

.no-title {
    display: block;
}
</style>