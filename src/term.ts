/**
 * 
 * 
 * lflag: {
            ECHO: false,
            ICANON: false,
            ISIG: false,
            IEXTEN: false
        },
        iflag: {
            ICRNL: false,
            IXON: false
        }
 */

/**
 * event name:
 * Control.O
 * ArrowUp
 * Escape
 * + Delete 0x1b5b337e;^[3~:1b5b337e:
 * Backspace
 * Enter
 * Tab
 * Delete
 * Space
 * a
 * 
 * keydown text
 * 
 * 
 * ArrowUp ArrowDown ArrowLeft ArrowRight Escape Backspace Enter Digit1 Backspace Tab ControlLeft ControlLeft KeyA Space F1 F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F12
 * KeyF KeyH KeyH KeyJ KeyK KeyM KeyL KeyK KeyL KeyM KeyK
 */

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
