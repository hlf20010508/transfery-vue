export function refresh(context) {
    context.$loading({
        fullscreen: true,
        background: "rgba(255, 255, 255, 0.5)",
    });
    setInterval(() => location.reload(), 500); //延迟0.5秒刷新，让loading图标能够显示全，不然只有一个点在转
}

export function autoRefreshAfterResume(context) {
    // 手机浏览器切出去后再回来就无法收到期间的消息，需要刷新
    if (document.visibilityState === "hidden") {
        //如果切出去太久，则会刷新页面
        console.log("app hidden");
        context.refreshInterval = setInterval(() => {
            refresh(context);
        }, 30 * 60 * 1000); //超过30钟没有切回就刷新
    }
    if (document.visibilityState === "visible") {
        clearInterval(context.refreshInterval); //取消计时
        console.log("app visible");
        //只刷新数据，不刷新页面
        context.sync();
    }
}