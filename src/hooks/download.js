/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import jquery from "jquery";
import http from "@/http";
import { isDemo } from "@/utils";

export function download(item) {
    console.log("download: ", item.fileName);

    if (isDemo()) {
        import("@/demo").then(module => {
            const useDemo = module.default();
            useDemo.download();
        })
        return;
    }

    http
        .get("/downloadUrl", { params: { fileName: item.fileName } })
        .then(res => {
            const data = res.data;

            if (data.success) {
                // 在安卓浏览器上可能会无法唤起下载
                // window.open(data.url, '_blank');

                let eleLink = jquery("<a></a>")
                    .attr("target", "_blank")
                    .attr("href", data.url)
                    .css("display", "none")
                    .appendTo("body");

                eleLink[0].click();
                eleLink.remove();
            }
        });
}