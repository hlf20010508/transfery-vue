/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { messageBuffer, messageItemRemoving, showToBottomButton } from "@/stores/message.js";
import { mockData } from "./store.js";
import { mockId } from "./mock.js"

function getNewPage($state) {
    messageBuffer.value = mockData;
    $state.complete();
}

function submitContent(item) {
    const id = mockId();
    item.id = id;
    item.hasChecked = true;
    messageBuffer.value[id] = item;
    console.log("pushed");
    messageAreaScrollToBottom();
}

function removeAll(message, messageConfig) {
    messageBuffer.value = {};
    messageItemRemoving.value = false;
    showToBottomButton.value = false;
    console.log("removed all items");
    message.success("删除成功", messageConfig);
}

export default function () {
    return {
        getNewPage,
        submitContent,
        removeAll,
    }
}