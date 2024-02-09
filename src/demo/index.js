/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { messageAreaScrollToBottom } from "@/hooks/message.js";
import { messageBuffer } from "@/stores/message.js";
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

export default function () {
    return {
        getNewPage,
        submitContent,
    }
}