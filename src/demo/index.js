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

function removeItem(item) {
    delete messageBuffer.value[item.id];
    console.log("removed");
}

function download() {
    alert("Demo 模式下无法下载");
}

function uploadFile(item) {
    item.fileName = item.content;
    const id = mockId();
    item.id = id;
    item.uploadId = id;
    messageBuffer.value[id] = item;
    console.log("upload item:", item)

    messageAreaScrollToBottom();

    uploadParts(item);
}

function uploadParts(item) {
    let interval = setInterval(() => {
        item.percentage += 10;
        if (item.percentage >= 100) {
            item.isComplete = true;
            clearInterval(interval);
        } else if (item.pause) {
            clearInterval(interval);
        }
    }, 1000);
}

function resumeUpload(id) {
    let item = messageBuffer.value[id];
    item.pause = false;
    console.log("resume uploadId:", item.uploadId);
    console.log("resume fileName:", item.fileName);

    uploadParts(item);
}

export default function () {
    return {
        getNewPage,
        submitContent,
        removeItem,
        removeAll,
        download,
        uploadFile,
        resumeUpload
    }
}