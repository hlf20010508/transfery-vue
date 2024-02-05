<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { computed } from "vue";
import { NTime, NIcon, NFlex, NCard } from "naive-ui";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { messageList, messageItemRemoving } from "@/stores/message.js";
import { shouldShowDate } from "@/hooks/message.js";
import { socket } from "@/socket"

let props = defineProps(["item", "index"]);

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
            <n-card embedded :bordered="false" content-style="padding: 0 16px;"
                footer-style="text-align: right; padding: 0 16px 8px 0;" :hoverable="true">
                <n-flex :wrap="false" align="center">
                    <slot name="left"></slot>
                    <div>
                        <slot name="container"></slot>
                        <n-flex :wrap="false" align="center" justify="end">
                            <slot name="footer"></slot>
                            <n-time :time="item.time" format="HH:mm:ss" />
                        </n-flex>
                    </div>
                </n-flex>
            </n-card>
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

.n-card {
    border-radius: 10px;
    width: max-content;
    min-width: 200px;
}

.n-icon:hover {
    cursor: pointer;
    color: var(--error-color-hover);
}
</style>