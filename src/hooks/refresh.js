/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { showRefreshSpin } from "@/stores/refresh.js";

export function refreshPage() {
    showRefreshSpin.value = true;

    //延迟0.5秒刷新，让loading图标能够显示全
    setTimeout(location.reload, 500);
}