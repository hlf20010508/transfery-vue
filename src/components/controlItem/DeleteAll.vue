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
import { messageBuffer, messageItemRemoving } from "@/stores/message.js"
import { updateMessageAreaHeight, messageAreaScrollToBottom, isMessageAreaAtBottom } from "@/hooks/message.js"
import { socket } from "@/socket";
import http from "@/http";

const message = useMessage();

watch(messageItemRemoving, () => {
    let flag = isMessageAreaAtBottom();
    updateMessageAreaHeight();
    // 如果已在底部，则显示全部删除按钮的时候也要在底部
    if (flag) {
        messageAreaScrollToBottom();
    }
});

const messageConfig = {
    closable: true,
    duration: 1500,
}

function removeAllItems() {
    if (confirm("确定要删除全部吗")) {
        http.get("/removeAll", {
            params: {
                sid: socket.id,
            },
        }).then(res => {
            if (res.data.success) {
                messageBuffer.value = {};
                messageItemRemoving.value = false;
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
    <n-icon v-if="messageItemRemoving" size="34" @click="removeAllItems">
        <CircleClose />
    </n-icon>
</template>

<style scoped>
.n-icon {
    display: block;
    margin: 10px auto;
}

.n-icon:hover {
    cursor: pointer;
    color: var(--error-color-hover);
}
</style>