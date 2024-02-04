<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted } from "vue";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import axios from "axios";
import MessageText from "./messageItem/MessageText.vue"
import { messageList } from "@/stores/message.js"
import { messageAreaScrollToBottom } from "@/hooks/message.js"
import { shouldShowDate } from "@/utils"

function getPageData() {
    let axiosResponse = axios
        .get("/get/page", {
            params: {
                size: messageList.value.length,
            },
        })
        .then((res) => {
            let data = res.data;
            let size = data.messages.length;
            let messages = [];
            if (size > 0) {
                messages = data.messages.reverse();
                messages[0].showDate = true;
                for (let i = 1; i < size; i++) {
                    messages[i].showDate = shouldShowDate(messages[i].time, messages[i - 1].time);
                }
            }

            return messages;
        });

    return axiosResponse;
}

function getNewPage($state) {
    getPageData().then((messages) => {
        let size = messages.length;
        if (size > 0) {
            if (messageList.value.length > 0) {
                messageList.value[0].showDate = shouldShowDate(messageList.value[0].time, messages[size - 1].time);
            }
            messageList.value.unshift(...messages);
            $state.loaded();
        } else {
            $state.complete();
        }
    })
}

// 用于在获取第一页后滚动到最下方
function getFirstPage() {
    getPageData().then((messages) => {
        messageList.value = messages;
        messageAreaScrollToBottom();
    })
}

onMounted(() => {
    getFirstPage();
})
</script>

<template>
    <div>
        <InfiniteLoading :firstload="false" @infinite="getNewPage" :distance="0" style="text-align: center;">
            <template #complete>没有更多了</template>
        </InfiniteLoading>
        <div v-for="(item, index) in messageList" :key="'message-item-' + index">
            <MessageText v-if="item.type === 'text'" :item="item" :index="index" />
        </div>
    </div>
</template>

<style scoped>
#message-area {
    height: 70%;
    margin: 0 10px 0 20px;
    padding-right: 10px;
    overflow: auto;
}
</style>