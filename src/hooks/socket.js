/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { messageBuffer } from "@/stores/message.js";
import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { socket } from "@/socket";

export function socketConnect() {
    console.log("socket connected:", socket.id);
}

export function socketDisconnect() {
    console.log("socket disconnected:", socket.id);
}

export function socketNewItem(item) {
    console.log("got new item");

    messageBuffer.value[item.id] = item;
    console.log("new item pushed");

    messageAreaScrollToBottom();
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