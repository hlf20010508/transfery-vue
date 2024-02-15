/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import getFingerprint from "@/utils/fingerprint.js"

const mode = import.meta.env.MODE

export function isDemo() {
    return mode === 'demo';
}

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

export { getFingerprint };