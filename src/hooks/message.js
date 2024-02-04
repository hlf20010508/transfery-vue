import { nextTick } from "vue";
import jquery from "jquery";

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