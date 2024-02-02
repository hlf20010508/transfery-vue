<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { NTime, NIcon, NFlex } from 'naive-ui';
import { CloseFilled } from '@vicons/carbon';
import { timeFormat } from '@/stores/globalVar.js';
import useMessageStore from "@/stores/message.js";
import { socket } from "@/socket"

defineProps(['item', 'messageItemRemoving', 'messageItemIndex']);

let { messageList } = useMessageStore();

function messageCopyText(content) {
    navigator.clipboard.writeText(content.trim());
}

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
    console.log(deletedItem)
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
    <n-flex>
        <n-icon size="16" v-show="messageItemRemoving" @click="messageRemoveItem(item, messageItemIndex)">
            <close-filled />
        </n-icon>
        <div @click="messageCopyText(item.content)">
            <p v-for="(contentItem, contentIndex) in item.content.trim().split('\n')" :key="'contentList' + contentIndex">
                {{ contentItem }}
            </p>
        </div>
    </n-flex>
</template>