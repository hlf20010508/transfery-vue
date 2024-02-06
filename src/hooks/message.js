/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { nextTick } from "vue";
import jquery from "jquery";

export function messageAreaScrollToBottom() {
    let messageArea = jquery("#message-area");
    nextTick(
        () => messageArea.scrollTop(messageArea.prop('scrollHeight'))
    );
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