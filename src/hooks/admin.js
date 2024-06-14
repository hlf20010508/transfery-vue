/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import http from "@/http";
import router from "@/router";
import { messageBuffer, infiniteLoadingReset } from "@/stores/message.js"
import { isAuthorized, isPrivate, isDeviceLoading, deviceList } from "@/stores/admin.js"
import { socket } from "@/socket";

export function auto_login() {
    if (!isAuthorized.value)
        http.get('/autoLogin', { params: { sid: socket.id } }).then(() => {
            isAuthorized.value = true;
        });
}

export function signOut() {
    http.get('/signOut', { params: { sid: socket.id } }).then(() => {
        isAuthorized.value = false;

        isPrivate.value = false;

        localStorage.clear();
        messageBuffer.value = {};

        infiniteLoadingReset.value = !infiniteLoadingReset.value;

        router.push({ name: "index" });
    });
}

export function getDeviceData() {
    http.get("/device").then(res => {
        deviceList.value = res.data;
        isDeviceLoading.value = false;
    });
}