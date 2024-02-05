/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { nextTick } from "vue";
import jquery from "jquery";
import { isSameDate } from "@/utils";

export function messageAreaScrollToBottom() {
    let messageArea = jquery("#message-area");
    nextTick(
        () => messageArea.scrollTop(messageArea.prop('scrollHeight'))
    );
}

export function isMessageAreaAtBottom() {
    let messageArea = jquery("#message-area");
    // 调用infinite loading后，scrollHeight比scrollTop少增加了1px，可能是小数点舍入了
    return messageArea.prop('scrollHeight') - messageArea.scrollTop() - 1 <= messageArea.prop('clientHeight');
}

export function updateMessageAreaHeight() {
    nextTick(() => {
        let htmlHeight = jquery("html").outerHeight(true);
        let timeBarHeight = jquery("#time-bar").outerHeight(true);
        let controlBarHeight = jquery("#control-bar").outerHeight(true);
        let inputAreaHeight = jquery("#input-area").outerHeight(true);
        jquery("#message-area").outerHeight(htmlHeight - timeBarHeight - controlBarHeight - inputAreaHeight);
    })
}

export function shouldShowDate(messageList, index) {
    if (index > 0) {
        let timestamp1 = messageList[index].time;
        let timestamp2 = messageList[index - 1].time;
        if (isSameDate(timestamp1, timestamp2)) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}