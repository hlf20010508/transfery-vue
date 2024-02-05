<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import axios from "axios";
import MessageText from "./messageItem/MessageText.vue"
import MessageFile from "./messageItem/MessageFile.vue"
import { messageList } from "@/stores/message.js"

function getNewPage($state) {
    axios.get(
        "/get/page",
        {
            params: {
                size: messageList.value.length,
            },
        }
    ).then((res) => {
        let data = res.data;
        if (data.messages.length > 0) {
            let messages = data.messages.reverse();
            messageList.value.unshift(...messages);
            $state.loaded();
        } else {
            $state.complete();
        }
    });
}
</script>

<template>
    <div>
        <InfiniteLoading :top="true" @infinite="getNewPage" target="#message-area" style="text-align: center;">
            <template #complete>没有更多了</template>
        </InfiniteLoading>
        <div v-for="(item, index) in messageList" :key="'message-item-' + index">
            <MessageText v-if="item.type === 'text'" :item="item" :index="index" />
            <MessageFile v-if="item.type === 'file'" :item="item" :index="index" />
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