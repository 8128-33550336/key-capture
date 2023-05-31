import { Termios, native } from "node-termios";
const { LFLAGS, IFLAGS } = native;

const captureSingleton = (() => {
    const fd = 0;
    const term = new Termios(fd);
    let oldLFlags = term.c_lflag;
    let oldIFlags = term.c_iflag;

    let isCapturing = false;

    const start = () => {
        if (isCapturing) {
            return;
        }
        isCapturing = true;
        oldLFlags = term.c_lflag;
        oldIFlags = term.c_iflag;
        term.c_lflag &= ~LFLAGS.ECHO;
        term.c_lflag &= ~LFLAGS.ICANON;
        term.c_lflag &= ~LFLAGS.ISIG;
        term.c_lflag &= ~LFLAGS.IEXTEN;
        term.c_iflag &= ~IFLAGS.ICRNL;
        term.c_iflag &= ~IFLAGS.IXON;
        term.writeTo(fd);
    };
    const stop = () => {
        if (!isCapturing) {
            return;
        }
        isCapturing = false;
        term.c_lflag = oldLFlags;
        term.c_iflag = oldIFlags;
        term.writeTo(fd);
    };
    const getIsCapturing = () => isCapturing;

    return {
        start,
        stop,
        getIsCapturing
    };
})();

export function getCapture() { return captureSingleton; };
