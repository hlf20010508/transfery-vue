/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import getFingerprint from "@/utils/fingerprint.js"

export function getCurrentTimeStamp() {
    return new Date().getTime()
}

export function isSameDate(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1).toLocaleDateString();
    const date2 = new Date(timestamp2).toLocaleDateString();

    return date1 === date2;
}

export function obj_length(obj) {
    return Object.keys(obj).length;
}

export function copyText(content) {
    content = content.trim();

    // 当上下文非安全时，即非https或localhost时，无法使用navigator.clipboard
    if (window.isSecureContext)
        navigator.clipboard.writeText(content);
    else
        copyTextFallback(content);
}

function copyTextFallback(content) {
    let textArea = document.createElement("textarea");
    textArea.value = content;

    // 不能使用
    // textArea.style.display = "none";

    // 使textarea不在视图中
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Copy fallback: unable to copy:', err);
    }

    document.body.removeChild(textArea);
}

export { getFingerprint };