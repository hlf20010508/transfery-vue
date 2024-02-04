import { nextTick } from "vue";
import jquery from "jquery";
import { isSameDate } from "@/utils";
import { messageList } from "@/stores/message.js"

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

export function shouldShowDate(index) {
    if (index > 0) {
        let timestamp1 = messageList.value[index].time;
        let timestamp2 = messageList.value[index - 1].time;
        if (isSameDate(timestamp1, timestamp2)) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}