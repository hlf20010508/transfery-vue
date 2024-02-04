<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { computed } from "vue";
import { NTime, NIcon, NFlex } from "naive-ui";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { messageList, messageItemRemoving } from "@/stores/message.js";
import { shouldShowDate } from "@/hooks/message.js";
import { socket } from "@/socket"

let  props = defineProps(["item", "index"]);

let showDate = computed(() => {
    return shouldShowDate(props.index);
});

function messageRemoveItem(item, index) {
    //删除项目
    console.log("remove item:", item);

    socket.emit("remove", item, (success) => {
        if (success) {
            messageList.value.splice(index, 1);
            console.log("removed");
        }
    });
}
</script>

<template>
    <div style="margin: 10px 0;">
        <n-time v-if="showDate" :time="item.time" format="yyyy-MM-dd" />
        <n-flex :wrap="false" align="center">
            <n-icon size="17" v-if="messageItemRemoving" @click="messageRemoveItem(item, index)">
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
    color: var(--error-color-hover);
}
</style>