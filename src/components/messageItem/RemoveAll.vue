<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { watch } from "vue";
import { NIcon, useMessage } from "naive-ui";
import { CircleClose } from "@element-plus/icons-vue";
import { messageBuffer, messageItemRemoving, showToBottomButton } from "@/stores/message.js"
import { socket } from "@/socket";
import http from "@/http";
import { obj_length, isDemo } from "@/utils";

watch(() => obj_length(messageBuffer.value), (newValue) => {
    if (newValue == 0) {
        messageItemRemoving.value = false;
    }
});

const message = useMessage();

const messageConfig = {
    closable: true,
    duration: 1500,
};

function removeAll() {
    if (confirm("确定要删除全部吗")) {
        if (isDemo()) {
            import("@/demo").then(module => {
                const useDemo = module.default();
                useDemo.removeAll(message, messageConfig);
            })
            return;
        }
        http.get("/removeAll", {
            params: {
                sid: socket.id,
            },
        }).then(res => {
            if (res.data.success) {
                messageBuffer.value = {};
                messageItemRemoving.value = false;
                showToBottomButton.value = false;
                console.log("removed all items");
                message.success("删除成功", messageConfig);
            }
        })
    } else {
        message.info("已取消删除", messageConfig);
    }
}
</script>

<template>
    <n-icon v-if="messageItemRemoving" @click="removeAll" size="34">
        <CircleClose />
    </n-icon>
</template>

<style scoped>
.n-icon {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: var(--background-color);
    border-radius: 50%;
}

.n-icon:hover {
    cursor: pointer;
    color: var(--error-color-hover);
}
</style>