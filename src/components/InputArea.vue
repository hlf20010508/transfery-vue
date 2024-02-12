<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NInput } from "naive-ui";
import { messageBuffer, messageItemRemoving } from "@/stores/message.js";
import { isPrivate } from "@/stores/admin.js";
import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { getCurrentTimeStamp, isDemo } from "@/utils"
import http from "@/http";
import { socket } from "@/socket";

let textContent = ref("");

function submitContent(content) {
    content = content.trim();
    if (content != "") {
        console.log("submit: ", content);

        let timestamp = getCurrentTimeStamp();

        let newItem = {
            content: content,
            type: "text",
            timestamp: timestamp,
        };

        if(isDemo()) {
            import("@/demo").then(module => {
                let useDemo = module.default();
                useDemo.submitContent(newItem);
            })
            return;
        }

        newItem.isPrivate = isPrivate.value;
        newItem.sid = socket.id;

        http.post("/newItem", newItem).then(res => {
            let data = res.data;
            if (data.success) {
                newItem.id = data.id;
                newItem.hasChecked = true;
                messageBuffer.value[newItem.id] = newItem;
                console.log("pushed");
                messageAreaScrollToBottom();
            }
        });
    }
}

function submit(event) {
    if (!event.shiftKey && event.keyCode == 13) {
        event.cancelBubble = true; // ie阻止冒泡行为
        event.stopPropagation(); // Firefox阻止冒泡行为
        event.preventDefault(); // 取消事件的默认动作

        submitContent(textContent.value);

        textContent.value = "";
    }
}

function handleInputAreaFocus() {
    messageItemRemoving.value = false;
}
</script>

<template>
    <n-input  id="input-area" v-model:value="textContent" type="textarea" :rows="5" placeholder="请输入消息内容" style="--n-border: none;"
        @focus="handleInputAreaFocus" @keydown="submit" />
</template>

<style scoped>
:deep(.n-input-wrapper) {
    resize: none !important;
    background: var(--background-color);
    border: 0px;
}
</style>