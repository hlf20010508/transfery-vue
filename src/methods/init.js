import jquery from "jquery";
import device from "current-device";
import {time} from "@/methods/utils.js"
import {autoRefreshAfterResume} from "@/methods/refresh.js"

export function adjustCSS() {
    let height = 0;
    height += jquery(".index-row1").outerHeight();
    height += jquery(".message-area").outerHeight();
    height += jquery(".index-row2").outerHeight();
    height += jquery(".control-bar").outerHeight();
    let heightHTML = jquery("body").outerHeight();
    jquery(".input-area-input").css("height", heightHTML - height + "px");
    jquery(".input-area-input textarea").css(
        "height",
        heightHTML - height - 10 + "px"
    );

    if (device.mobile()) {
        //手机
        jquery("body").css("background", "#409eff");
    }
}

export function setUpdateTime(context) {
    setInterval(() => (context.now = time(Date.parse(Date()))), 1000);
}

export function setHeight(context) {
    context.htmlHeight = jquery("html").outerHeight();
    context.displayHeight = jquery(".message-area").outerHeight();
}

export function setAutoRefresh(context) {
    window.addEventListener("visibilitychange", () => autoRefreshAfterResume(context));
}