/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import device from "current-device";
import keyboardObserver from "keyboard-height";

export function listenResize(context) {
    //安卓
    let newWindowHeight = jquery(window).height();
    if (context.windowHeight == newWindowHeight) {
        jquery(".message-area").css("height", context.displayHeight + "px");
    } else {
        let keyboardHeight = keyboardObserver.getKeyboardHeight();
        jquery(".message-area").css(
            "height",
            context.displayHeight - keyboardHeight + "px"
        );
        context.toBottom();
    }
}

export function focus(context) {
    if (device.iphone() || device.ipod()) {
        //苹果 输入法获取焦点时页面元素高度不变，整体向上移动，因此在键盘呼出后滚动到最上方并减小页面和显示框的高度，以保证整体在可视范围内
        //需要延迟，不然检测时键盘还没呼出，得到的高度为0
        setTimeout(() => {
            let keyboardHeight = keyboardObserver.getKeyboardHeight(); //获取键盘高度
            if (keyboardHeight < 200) {
                keyboardHeight = 320; // ios safari 打开上传详情聚焦输入框时会获取不到键盘高度。webapp下没有问题
            }
            jquery(window).scrollTop(0); //滚动到页面最上方
            jquery("html").css("height", context.htmlHeight - keyboardHeight + "px"); //减小页面高度, 若不减小，输入框高度会变大
            jquery(".message-area").css(
                "height",
                context.displayHeight - keyboardHeight + "px"
            ); //减小显示框高度

            context.toBottom();
        }, 300);
    }
    if (device.androidPhone()) {
        //安卓 输入法获取焦点时页面元素高度改变，且收起键盘后不失去焦点。主要麻烦在于收起键盘不失去焦点。因此需要在获得焦点时监听页面高度
        //若页面高度恢复初始高度，说明键盘收起，则恢复显示框高度；若页面高度小于初始高度，说明键盘又被调起，则减小显示框高度
        setTimeout(() => {
            let keyboardHeight = keyboardObserver.getKeyboardHeight();
            jquery(".message-area").css(
                "height",
                context.displayHeight - keyboardHeight + "px"
            );
            context.toBottom();
        }, 300);
        context.windowHeight = jquery(window).height();
        window.addEventListener("resize", context.listenResize);
    }
}

export function blur(context) {
    if (device.iphone() || device.ipod()) {
        jquery("html").css("height", context.htmlHeight + "px");
        jquery(".message-area").css("height", context.displayHeight + "px");
    }
    if (device.androidPhone()) {
        window.removeEventListener("resize", context.listenResize);
        jquery(".message-area").css("height", context.displayHeight + "px");
    }
}