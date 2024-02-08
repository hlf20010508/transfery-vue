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

// 改变html的大小不会触发
export function updateMessageAreaHeight() {
    nextTick(() => {
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
    })
}