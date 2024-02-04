<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NInput } from "naive-ui";
import { messageList } from "@/stores/message.js";
import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { getCurrentTimeStamp } from "@/utils"
import { socket } from "@/socket"

let textContent = ref("");

function submitContent(content) {
    content = content.trim();
    if (content != "") {
        console.log("submit: ", content);

        let time = getCurrentTimeStamp();

        let newItem = {
            content: content,
            type: "text",
            time: time,
        };
        socket.emit("pushItem", newItem, (id, success) => {
            if (success) {
                newItem.id = id;
                messageList.value.push(newItem);
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

function handleInputAreaFocus() { }

function handleInputAreaBlur() { }
</script>

<template>
    <n-input v-model:value="textContent" type="textarea" :rows="5" placeholder="请输入消息内容"
        style="--n-border: none;" @focus="handleInputAreaFocus" @blur="handleInputAreaBlur" @keydown="submit" />
</template>

<style scoped>
:deep(.n-input-wrapper) {
    resize: none !important;
    background: var(--background-color);
    border: 0px;
}
</style>