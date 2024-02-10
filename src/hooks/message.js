/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { nextTick } from "vue";
import jquery from "jquery";
import device from "current-device";
import { showToBottomButton } from "@/stores/message.js"

export function isMessageAreaAtBottom() {
    let messageArea = jquery("#message-area");
    // 调用infinite loading后，scrollHeight比scrollTop少增加了1px，可能是小数点舍入了
    return messageArea.prop('scrollHeight') - messageArea.scrollTop() - 1 <= messageArea.prop('clientHeight');
}

export function messageAreaScrollToBottom() {
    nextTick(() => {
        let messageArea = jquery("#message-area");
        messageArea.scrollTop(messageArea.prop('scrollHeight'));
        showToBottomButton.value = false;
    });
}

export function updateMessageAreaHeight() {
    // 更新message-area高度
    // 获取可视区域高度
    let visualHeight = window.visualViewport.height;
    let titleBarHeight = jquery("#title-bar").outerHeight(true);
    let controlBarHeight = jquery("#control-bar").outerHeight(true);
    let inputAreaHeight = jquery("#input-area").outerHeight(true);
    let messageAreaHeight = visualHeight - titleBarHeight - controlBarHeight - inputAreaHeight;
    jquery("#message-area").outerHeight(messageAreaHeight);

    // 更新empty图标大小
    let appWidth = jquery("#app").width();
    // 使用较小长度的一半
    let emptyIconSize = appWidth < messageAreaHeight ? parseInt(appWidth / 2) : parseInt(messageAreaHeight / 2);
    jquery(".n-empty__icon").css("--n-icon-size", emptyIconSize + "px");

    // 苹果：输入法获取焦点时window高度不变，整体向上移动
    // 安卓：呼出键盘时改变window高度
    if (device.ios()) window.scrollTo(0, 0); // 滚动到页面最上方
    if (device.mobile() || device.tablet()) messageAreaScrollToBottom();
}