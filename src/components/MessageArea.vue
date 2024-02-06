<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { computed } from "vue";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import http from "@/http";
import MessageText from "./messageItem/MessageText.vue"
import MessageFile from "./messageItem/MessageFile.vue"
import { messageBuffer } from "@/stores/message.js"
import { obj_length } from "@/utils";

function getNewPage($state) {
    http.get(
        "/page",
        {
            params: {
                size: obj_length(messageBuffer.value),
            },
        }
    ).then(res => {
        let data = res.data;
        if (data.messages.length > 0) {
            let messages = data.messages;
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i];
                if (message.type === "file") {
                    message.percentage = 0;
                    message.pause = false;
                }
                messageBuffer.value[message.id] = message;
            }
            $state.loaded();
        } else {
            $state.complete();
        }
    });
}

function getMessageList() {
    let messageList = Object.values(messageBuffer.value);
    messageList.sort((a, b) => {
        // 按timestamp升序
        const timestampDiff = a.timestamp - b.timestamp;
        if (timestampDiff === 0) {
            // 如果timestamp相同，则按id升序
            return a.id - b.id;
        }
        return timestampDiff;
    });
    return messageList;
}

let messageList = computed(getMessageList);
</script>

<template>
    <div>
        <InfiniteLoading :top="true" @infinite="getNewPage" target="#message-area" style="text-align: center;">
            <template #complete>没有更多了</template>
        </InfiniteLoading>
        <div v-for="(item, index) in messageList" :key="'message-item-' + item.id">
            <MessageText v-if="item.type === 'text'" :messageList="messageList" :index="index" />
            <MessageFile v-if="item.type === 'file'" :messageList="messageList" :index="index" />
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