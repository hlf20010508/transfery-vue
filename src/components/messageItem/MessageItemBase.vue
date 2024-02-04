<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NTime, NIcon, NFlex } from "naive-ui";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { messageList } from "@/stores/message.js";
import { timeFormat } from "@/stores/globalVar.js";
import { socket } from "@/socket"

defineProps(["item", "messageItemRemoving", "messageItemIndex"]);

function messageRemoveItem(item, index) {
    //删除项目
    console.log("remove item:", item);
    let showTime = false;
    let deletedItem = item;
    deletedItem.change = {};
    if (index != messageList.value.length - 1) {
        if (messageList.value[index].showTime) {
            //如果被删除的项目会显示时间，则将下一个项目改为会显示时间
            showTime = true;
            // BUG: 后端没有更改
            deletedItem.change = {
                id: messageList.value[index + 1].id,
            };
        }
    }

    socket.emit("remove", deletedItem, (success) => {
        if (success) {
            if (showTime) {
                messageList.value[index + 1].showTime = true;
            }
            messageList.value.splice(index, 1);
            console.log("removed");
        }
    });
}
</script>

<template>
    <n-time v-if="item.showTime" :time="item.time" :format="timeFormat" />
    <n-flex :wrap="false" align="center">
        <n-icon size="17" v-show="messageItemRemoving" @click="messageRemoveItem(item, messageItemIndex)">
            <CircleCloseFilled />
        </n-icon>
        <slot></slot>
    </n-flex>
</template>

<style scoped>
time {
    display: block;
    text-align: left;
    font-size: 14px;
    color: #aaa;
}

.n-icon:hover {
    cursor: pointer;
    color: #f56c6c;
}
</style>