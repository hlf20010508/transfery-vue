/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { messageBuffer } from "@/stores/message.js";
import { mockData } from "./store.js";

function getNewPage($state) {
    messageBuffer.value = mockData;
    $state.complete();
}

export default function () {
    return {
        getNewPage,
    }
}