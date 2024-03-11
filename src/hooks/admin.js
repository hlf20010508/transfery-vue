/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import http from "@/http";
import router from "@/router";
import { messageBuffer, infiniteLoadingReset } from "@/stores/message.js"
import { socketJoinRoom, socketLeaveRoom } from "@/hooks/socket.js"
import { isAuthorized, isPrivate, isDeviceLoading, deviceList } from "@/stores/admin.js"

export async function auto_login() {
    if (!isAuthorized.value)
        await http.get('/login').then(res => {
            if (res.data.success)
                isAuthorized.value = true;
        });

    socketJoinRoom();
}

export function signOut() {
    socketLeaveRoom();
    isAuthorized.value = false;
    socketJoinRoom();

    isPrivate.value = false;

    localStorage.clear();
    messageBuffer.value = {};

    infiniteLoadingReset.value = !infiniteLoadingReset.value;

    router.push({ name: "index"});
}

export function getDeviceData() {
    http.get("/device").then(res => {
        const data = res.data;
        if (data.success) {
            deviceList.value = data.device;
            isDeviceLoading.value = false;
        }
    });
}