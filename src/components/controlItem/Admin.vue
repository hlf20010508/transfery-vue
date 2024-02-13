<script setup>
import { User } from "@element-plus/icons-vue";
import { NDropdown, useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import ControlItemBase from "./ControlItemBase.vue";
import { isAuthorized, isPrivate } from "@/stores/admin.js"
import { messageBuffer, infiniteLoadingReset } from "@/stores/message.js"

const router = useRouter();
const message = useMessage();

const options = [{
    label: "退出",
    key: "quit"
}];

function clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
}

function handleSelect(key) {
    if (key === "quit") {
        isAuthorized.value = false;
        isPrivate.value = false;
        clearAllCookies();
        messageBuffer.value = {};
        infiniteLoadingReset.value = !infiniteLoadingReset.value;
        console.log("退出成功");
        message.success("退出成功");
    }
}
</script>

<template>
    <ControlItemBase>
        <n-dropdown v-if="isAuthorized" trigger="click" :options="options" @select="handleSelect">
            <User />
        </n-dropdown>
        <User v-else @click="router.push({name: 'login'})"/>
    </ControlItemBase>
</template>