<script setup>
import { User } from "@element-plus/icons-vue";
import { NDropdown, useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import ControlItemBase from "./ControlItemBase.vue";
import { isAuthorized, isPrivate } from "@/stores/admin.js"
import { messageBuffer, infiniteLoadingReset } from "@/stores/message.js"
import { socket } from "@/socket";

const router = useRouter();
const message = useMessage();

const options = [{
    label: "退出",
    key: "quit"
}];

function handleSelect(key) {
    if (key === "quit") {
        isAuthorized.value = false;
        isPrivate.value = false;

        localStorage.clear();
        messageBuffer.value = {};

        infiniteLoadingReset.value = !infiniteLoadingReset.value;

        socket.emit("leaveRoom", "private");
        socket.emit("joinRoom", "public");

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