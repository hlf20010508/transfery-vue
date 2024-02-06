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
import { messageItemRemoving } from "@/stores/message.js";
import { isSameDate } from "@/utils";
import { messageBuffer } from "@/stores/message.js";
import { socket } from "@/socket";
import http from "@/http";

let props = defineProps(["messageList", "index"]);

let item = props.messageList[props.index];

function shouldShowDate() {
    let messageList = props.messageList;
    let index = props.index;

    if (index > 0) {
        let timestamp1 = messageList[index].timestamp;
        let timestamp2 = messageList[index - 1].timestamp;

        if (isSameDate(timestamp1, timestamp2)) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function removeItem() {
    console.log("remove item:", item);

    item.sid = socket.id;

    http.post("/removeItem", item).then(res => {
        let data = res.data;
        if (data.success) {
            delete messageBuffer.value[item.id];
            console.log("removed");
        }
    });
}

let showDate = computed(shouldShowDate);
</script>

<template>
    <div style="margin: 10px 0;">
        <n-time v-if="showDate" :time="item.timestamp" format="yyyy-MM-dd" />
        <n-flex :wrap="false" align="center">
            <n-icon size="17" v-if="messageItemRemoving" @click="removeItem">
                <CircleCloseFilled />
            </n-icon>
            <n-card embedded :bordered="false" content-style="padding: 0 16px;"
                footer-style="text-align: right; padding: 0 16px 8px 0;" :hoverable="true">
                <n-flex :wrap="false" align="center">
                    <slot name="left"></slot>
                    <div class="content-div">
                        <slot name="container"></slot>
                        <n-flex :wrap="false" align="center" justify="end">
                            <slot name="footer"></slot>
                            <n-time :time="item.timestamp" format="HH:mm:ss" />
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

.content-div {
    /* 当内容宽度比200px小时，向右占满n-card */
    flex: 1;
}
</style>