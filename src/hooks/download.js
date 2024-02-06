/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import http from "@/http";

export function download(item) {
    console.log("download: ", item.fileName);
    http
        .get("/downloadUrl", { params: { fileName: item.fileName } })
        .then(res => {
            let data = res.data;
            if (data.success) {
                window.open(data.url, '_blank');
            }
        });
}