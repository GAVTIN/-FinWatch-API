const monitorEventLoop = (threshold = 50) => {
    let last = Date.now();
    setInterval(() => {
        const now = Date.now();
        const lag = now - last - 100;    // expected 100ms, actual delta
        if (lag > threshold)
            console.warn(`[EventLoop] lag detected: ${lag}ms`);
        last = now;
    }, 100).unref();                   // .unref() won't block process exit
};
module.exports = monitorEventLoop;
