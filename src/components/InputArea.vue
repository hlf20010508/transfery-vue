<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { ref } from "vue";
import { NInput } from "naive-ui";
import device from "current-device";
import { messageBuffer, messageItemRemoving } from "@/stores/message.js";
import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { getCurrentTimeStamp } from "@/utils"
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
            sid: socket.id,
        };

        http.post("/newItem", newItem).then(res => {
            let data = res.data;
            if (data.success) {
                newItem.id = data.id;
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

    // 苹果
    // 输入法获取焦点时window高度不变，整体向上移动
    if (device.ios()) {
        //需要延迟，不然检测时键盘还没呼出，得到的高度为0
        setTimeout(() => {
            window.scrollTo(0, 0); // 滚动到页面最上方
            messageAreaScrollToBottom();
        }, 400);
    }

    // 安卓
    // 呼出键盘时改变window高度，所以直接能够被检测到
    if (device.androidPhone()) {
        messageAreaScrollToBottom();
    }
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