/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { messageBuffer } from "@/stores/message.js";
import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { connectionNumber } from "@/stores/connection.js";
import { socket } from "@/socket";

export function socketConnect() {
    console.log("socket connected:", socket.id);
}

export function socketNewItem(item) {
    console.log("got new item");

    if (item.type === "file") {
        item.percentage = 0;
        item.pause = false;
    }
    messageBuffer.value[item.id] = item;
    console.log("new item pushed");

    messageAreaScrollToBottom();
}

export function socketProgress(data) {
    Object.assign(messageBuffer.value[data.id], data);
}

export function socketRemoveItem(id) {
    console.log("got item to be removed:", messageBuffer.value[id]);

    delete messageBuffer.value[id];
    console.log("item removed");
}

export function socketRemoveAll() {
    messageBuffer.value = {};
    console.log("all items removed");
}

export function socketEmitProgress(item) {
    socket.emit("progress", {
        id: item.id,
        percentage: item.percentage,
        pause: item.pause,
        isComplete: item.isComplete
    });
}

export function socketConnectionNumber(number) {
    connectionNumber.value = number;
}