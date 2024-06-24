/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

export function download(item) {
    console.log("download: ", item.fileName);

    let url = "/download?fileName=" + item.fileName;
    if (import.meta.env.DEV)
        url = "/api" + url

    window.location.href = url;
}