/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import fingerprintjs from "@fingerprintjs/fingerprintjs";
import http from "@/http";
import { isAuthorized, getBaseHeaders } from "@/stores/admin.js"
import { socket } from "@/socket";

// 获取浏览器指纹
export async function getFingerPrint() {
    const fingerprint = await fingerprintjs.load();
    const result = await fingerprint.get();

    return result.visitorId;
}

export async function auto_login() {
    if (!isAuthorized.value)
        await http.get('/login', { headers: getBaseHeaders() }).then(res => {
            if (res.data.success)
                isAuthorized.value = true;
        });

    socket.emit("joinRoom", isAuthorized.value ? "private" : "public");
}