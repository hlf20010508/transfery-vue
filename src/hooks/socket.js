/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { isMessageAreaAtBottom, messageAreaScrollToBottom } from "@/hooks/message.js";
import { getCertificate } from "@/hooks/certificate.js";
import { signOut, getDeviceData } from "@/hooks/admin.js";
import { messageBuffer, newMessageNumber, showToBottomButton } from "@/stores/message.js";
import { isAuthorized, fingerprint } from "@/stores/admin.js";
import { connectionNumber } from "@/stores/connection.js";
import { socket } from "@/socket";

export function socketConnect() {
    console.log("socket connected:", socket.id);
}

export function socketNewItem(item) {
    console.log("got new item");

    // 是否已被看到
    item.hasChecked = false;
    if (item.type === "file") {
        item.percentage = 0;
        item.pause = false;
    }

    messageBuffer.value[item.id] = item;
    console.log("new item pushed");

    newMessageNumber.value += 1;

    if (!isMessageAreaAtBottom())
        showToBottomButton.value = true;
    else
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

export function socketJoinRoom() {
    if (isAuthorized.value) {
        const data = {
            authorization: getCertificate(),
            roomName: "private"
        };
        socket.emit("joinRoom", data);
    } else
        socket.emit("joinRoom", { roomName: "public" });
}

export function socketLeaveRoom() {
    socket.emit("leaveRoom", isAuthorized.value ? "private" : "public")
}

export function socketConnectionNumber(number) {
    connectionNumber.value = number;
}

export function socketSignOut(rFingerprint) {
    if (rFingerprint == fingerprint) {
        signOut();

        alert("已被管理员退出");
    } else
        getDeviceData();
}