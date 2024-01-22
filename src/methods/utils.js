/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import Moment from "moment";

export function time(timeParse) {
    let date = new Moment(timeParse);
    return date.format("YYYY-MM-DD HH:mm:ss");
}

export function shouldShowTime(time1, time2) {
    let date1 = new Date(time1);
    let date2 = new Date(time2);
    if (Math.abs(date1.getTime() - date2.getTime()) > 1000 * 60) {
        return true;
    }
    return false;
}

export function copy(content) {
    navigator.clipboard.writeText(content.trim());
}

export function isInArray(item, array) {
    for (let i of array) {
        if (i === item) {
            return true;
        }
    }
    return false;
}