import { showRefreshSpin } from "@/stores/refresh.js";

export function refreshPage() {
    showRefreshSpin.value = true;
    //延迟0.5秒刷新，让loading图标能够显示全，不然只有一个点在转
    setInterval(() => location.reload(), 500);
}