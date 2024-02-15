/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import http from "@/http";
import { isAuthorized } from "@/stores/admin.js"
import { socketJoinRoom } from "@/hooks/socket.js"

export async function auto_login() {
    if (!isAuthorized.value)
        await http.get('/login').then(res => {
            if (res.data.success)
                isAuthorized.value = true;
        });

    socketJoinRoom();
}