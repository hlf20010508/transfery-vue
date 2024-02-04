<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { onMounted } from "vue";
import InfiniteLoading from "v3-infinite-loading";
import axios from "axios";
import MessageText from "./messageItem/MessageText.vue"
import { messageList, messageItemRemoving } from "@/stores/message.js"
import { messageAreaScrollToBottom } from "@/hooks/message.js"

function getNewPage($state) {
    axios
        .get("/get/page", {
            params: {
                size: messageList.value.length,
            },
        })
        .then((response) => {
            let data = response.data;
            if (data.messages.length) {
                messageList.value.unshift(...data.messages.reverse());
                $state.loaded();
            } else {
                $state.complete();
            }
        });
}

// 用于在获取第一页后滚动到最下方
function getFirstPage() {
    axios
        .get("/get/page", {
            params: {
                size: messageList.value.length,
            },
        })
        .then((response) => {
            let data = response.data;
            if (data.messages.length) {
                messageList.value.unshift(...data.messages.reverse());
            }
            messageAreaScrollToBottom();
        });
}

onMounted(() => {
    getFirstPage();
})
</script>

<template>
    <div id="message-area">
        <InfiniteLoading :firstload="false" @infinite="getNewPage" :distance="0">
            <template #complete>没有更多了</template>
        </InfiniteLoading>
        <div v-for="(messageItem, messageItemIndex) in messageList" :key="'message-item-' + messageItemIndex">
            <MessageText v-if="messageItem.type === 'text'" :item="messageItem" :messageItemRemoving="messageItemRemoving"
                :messageItemIndex="messageItemIndex" />
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