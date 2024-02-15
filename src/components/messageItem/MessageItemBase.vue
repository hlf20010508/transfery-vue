<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { NTime, NIcon, NFlex, NCard } from "naive-ui";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { messageItemRemoving, messageBuffer, newMessageNumber } from "@/stores/message.js";
import { isSameDate, isDemo } from "@/utils";
import { socket } from "@/socket";
import http from "@/http";

const props = defineProps(["messageList", "index"]);
let item = props.messageList[props.index];

function shouldShowDate() {
    const messageList = props.messageList;
    const index = props.index;

    if (index > 0) {
        const timestamp1 = messageList[index].timestamp;
        const timestamp2 = messageList[index - 1].timestamp;

        if (isSameDate(timestamp1, timestamp2))
            return false;
        else
            return true;
    } else
        return true;
}

function removeItem() {
    console.log("remove item:", item);

    if (isDemo()) {
        import("@/demo").then(module => {
            const useDemo = module.default();
            useDemo.removeItem(item);
        })
        return;
    }

    item.sid = socket.id;

    http.post("/removeItem", item).then(res => {
        const data = res.data;
        if (data.success) {
            delete messageBuffer.value[item.id];
            console.log("removed");
        }
    });
}

let showDate = computed(shouldShowDate);

if (!item.hasChecked) {
    let ElementVisibleObserver;
    let targetElement;

    onMounted(() => {
        // 监视新消息是否能够被看见
        ElementVisibleObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    messageBuffer.value[item.id].hasChecked = true;
                    newMessageNumber.value -= 1;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 1.0 // 1.0表示元素100%进入视口时触发
        });
        targetElement = document.querySelector('#message-item-' + item.id);
        ElementVisibleObserver.observe(targetElement);
    })

    onUnmounted(() => ElementVisibleObserver.unobserve(targetElement));
}
</script>

<template>
    <div :id="'message-item-' + item.id" style="margin: 10px 0;">
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
                            <span v-if="item.isPrivate" class="mode-hint">私密</span>
                            <span v-if="isDemo()" class="mode-hint">模拟</span>
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
    color: var(--hint-color);
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

.mode-hint {
    color: var(--hint-color);
}
</style>