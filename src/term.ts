const captureSingleton = (() => {
    let isCapturing = false;

    const start = () => {
        if (isCapturing) {
            return;
        }
        isCapturing = true;
        process.stdin.setRawMode(true);
    };
    const stop = () => {
        if (!isCapturing) {
            return;
        }
        isCapturing = false;
        process.stdin.setRawMode(false);
    };
    const getIsCapturing = () => isCapturing;

    return {
        start,
        stop,
        getIsCapturing
    };
})();

export function getCapture() { return captureSingleton; };
