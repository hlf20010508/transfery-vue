<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NTime, NIcon, NFlex } from "naive-ui";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { messageList, messageItemRemoving } from "@/stores/message.js";
import { socket } from "@/socket"

defineProps(["item", "index"]);

function messageRemoveItem(item, index) {
    //删除项目
    console.log("remove item:", item);
    let showDate = false;
    let deletedItem = item;
    if (index != messageList.value.length - 1) {
        if (messageList.value[index].showDate) {
            //如果被删除的项目会显示时间，则将下一个项目改为会显示时间
            showDate = true
        }
    }

    socket.emit("remove", deletedItem, (success) => {
        if (success) {
            if (showDate) {
                messageList.value[index + 1].showDate = true;
            }
            messageList.value.splice(index, 1);
            console.log("removed");
        }
    });
}
</script>

<template>
    <div style="margin: 10px 0;">
        <n-time v-if="item.showDate" :time="item.time" format="yyyy-MM-dd" />
        <n-flex :wrap="false" align="center">
            <n-icon size="17" v-show="messageItemRemoving" @click="messageRemoveItem(item, index)">
                <CircleCloseFilled />
            </n-icon>
            <slot></slot>
        </n-flex>
    </div>
</template>

<style scoped>
time {
    display: block;
    font-size: 14px;
    color: #aaa;
    text-align: center;
}

.n-icon:hover {
    cursor: pointer;
    color: #f56c6c;
}
</style>