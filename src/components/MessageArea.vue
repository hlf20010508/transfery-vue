<!--
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
-->

<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { NEmpty } from "naive-ui";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import http from "@/http";
import MessageText from "./messageItem/MessageText.vue"
import MessageFile from "./messageItem/MessageFile.vue"
import ToBottomButton from "./messageItem/ToBottomButton.vue"
import { messageBuffer, showToBottomButton, infiniteLoadingReset } from "@/stores/message.js"
import RemoveAll from "./messageItem/RemoveAll.vue";
import { messageAreaScrollToBottom, isMessageAreaAtBottom } from "@/hooks/message.js"
import { refreshPage } from "@/hooks/refresh.js"
import { obj_length } from "@/utils";

function getNewPage($state) {
    http.get(
        "/page",
        { params: { size: obj_length(messageBuffer.value) } }
    ).then(res => {
        const messages = res.data;
        if (messages.length > 0) {
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i];

                message.hasChecked = true;
                if (message.type === "file") {
                    message.percentage = 0;
                    message.pause = true;
                    message.isHost = false;
                }

                messageBuffer.value[message.id] = message;
            }
            $state.loaded();
        } else
            $state.complete();
    });
}

function getMessageList() {
    let messageList = Object.values(messageBuffer.value);

    messageList.sort((a, b) => {
        // 按timestamp升序
        const timestampDiff = a.timestamp - b.timestamp;
        if (timestampDiff === 0)
            // 如果timestamp相同，则按id升序
            return a.id - b.id;

        return timestampDiff;
    });

    return messageList;
}

let messageList = computed(getMessageList);

function sync() {
    console.log("syncing...");
    // 获取消息id的最大值，即key的最大值
    let latestId = Math.max(...Object.keys(messageBuffer.value).map(key => Number(key)));

    // 如果没有消息，则将latestId设为0
    if (latestId === -Infinity) {
        latestId = 0;
    }

    http
        .get("/sync", {
            params: {
                latestId: latestId,
            },
        })
        .then((res) => {
            const itemsToBeSynced = res.data;
            console.log("received synced new items:", itemsToBeSynced);

            // 如果有真正的新消息，就在同步完毕后滚动到底部
            let hasNewItem = false;
            for (let newItem of itemsToBeSynced) {
                if (!(newItem.id in messageBuffer.value)) {
                    messageBuffer.value[newItem.id] = newItem;
                    hasNewItem = true;
                }
            }

            if (hasNewItem) {
                messageAreaScrollToBottom();
                console.log("new items synced");
            } else
                console.log("no unsynced item");
        });
}

let timer = -1; // 未定义计时器时的默认ID
const refreshInterval = 30 * 60 * 1000 // 30min

function autoSync() {
    // 手机浏览器切出去后再回来就无法收到期间的消息，需要刷新
    if (document.visibilityState === "hidden") {
        //如果切出去太久，则会刷新页面
        console.log("app hidden");

        timer = setInterval(
            refreshPage,
            refreshInterval
        ); //超过时间没有切回，在切回后刷新
    }

    // 切回后同步数据
    if (document.visibilityState === "visible") {
        console.log("app visible");

        clearInterval(timer); //清除计时器

        sync(); //刷新数据
    }
}

function handleScroll() {
    if (!isMessageAreaAtBottom())
        showToBottomButton.value = true;
    else
        showToBottomButton.value = false;
}

onMounted(() => {
    window.addEventListener("visibilitychange", autoSync);
});

onBeforeUnmount(() => window.removeEventListener("visibilitychange", autoSync));
</script>

<template>
    <div style="position: relative;">
        <div id="message-area" @scroll="handleScroll">
            <InfiniteLoading :top="true" @infinite="getNewPage" target="#message-area"
                :identifier="infiniteLoadingReset" style="text-align: center;" class="infinite-loading">
                <template #complete>
                    <span>{{ "" }}</span>
                </template>
            </InfiniteLoading>
            <n-empty v-show="messageList.length === 0" description="无消息">
            </n-empty>
            <div v-for="(item, index) in messageList" :key="'message-item-' + item.id">
                <MessageText v-if="item.type === 'text'" :messageList="messageList" :index="index" />
                <MessageFile v-if="item.type === 'file'" :messageList="messageList" :index="index" />
            </div>
            <RemoveAll />
            <ToBottomButton />
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

.infinite-loading :deep(.container) {
    margin-top: 10px;
}

.n-empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>