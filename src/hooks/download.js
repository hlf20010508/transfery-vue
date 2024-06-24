/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import jquery from "jquery";
import http from "@/http";

function vclick_download(url, fileName) {
    // 在安卓浏览器上可能会无法唤起下载
    // window.open(data.url, '_blank');

    let eleLink = jquery("<a></a>")
        .attr("target", "_blank")
        .attr("href", url)
        .attr("download", fileName)
        .css("display", "none")
        .appendTo("body");

    eleLink[0].click();
    eleLink.remove();
}

export function download(item) {
    console.log("download: ", item.fileName);

    http
        .get("/download", { params: { fileName: item.fileName }, responseType: 'blob' })
        .then(res => {
            const contentDisposition = res.headers['content-disposition'];
            const isStream = contentDisposition && contentDisposition.indexOf('attachment') !== -1;

            if (isStream) {
                // 创建一个blob URL并下载
                const blob = new Blob([res.data]);
                const url = window.URL.createObjectURL(blob);

                vclick_download(url, item.fileName);
                // window.URL.revokeObjectURL(url); // 释放URL对象
            } else {
                res.data.text().then(url => {
                    vclick_download(url, item.fileName);
                })
            }
        });
}