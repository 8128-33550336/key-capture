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


/*

0x1b4f50;^[P:1b4f50:  f1
0x1b4f51;^[Q:1b4f51:f2
0x1b4f52;^[R:1b4f52:f3f
0x1b4f53;^[S:1b4f53:f4
0x1b5b31357e;^[15~:1b5b31357e:f5
0x1b5b31377e;^[17~:1b5b31377e:f6
0x1b5b31387e;^[18~:1b5b31387e:f7
0x1b5b31397e;^[19~:1b5b31397e:f8
0x1b5b32307e;^[20~:1b5b32307e:f9
0x1b5b32317e;^[21~:1b5b32317e:f10
0x1b5b32337e;^[23~:1b5b32337e:f11
0x1b5b32347e;^[24~:1b5b32347e:f12

0x1b5b32347e;^[25~:1b5b32347e:f13
0x1b5b32347e;^[26~:1b5b32347e:f14
0x1b5b32347e;^[28~:1b5b32347e:f15
0x1b5b32347e;^[29~:1b5b32347e:f16
0x1b5b32347e;^[31~:1b5b32347e:f17
0x1b5b32347e;^[32~:1b5b32347e:f18
0x1b5b32347e;^[33~:1b5b32347e:f19
0x1b5b32347e;^[34~:1b5b32347e:f20



0x1b5b313b3250;^[1;2P:1b5b313b3250:shift f1
0x1b5b313b3251;^[1;2Q:1b5b313b3251:sf2
0x1b5b313b3252;^[1;2R:1b5b313b3252:sf3
0x1b5b313b3253;^[1;2S:1b5b313b3253:sf4
0x1b5b31353b327e;^[15;2~:1b5b31353b327e:sf5
0x1b5b31373b327e;^[17;2~:1b5b31373b327e:sf6
0x1b5b31383b327e;^[18;2~:1b5b31383b327e:sf7
0x1b5b31393b327e;^[19;2~:1b5b31393b327e:sf8
0x1b5b32303b327e;^[20;2~:1b5b32303b327e:sf9
0x1b5b32313b327e;^[21;2~:1b5b32313b327e:sf10
0x1b5b32333b327e;^[23;2~:1b5b32333b327e:sf11
0x1b5b32343b327e;^[24;2~:1b5b32343b327e:sf12
0x1b5b46;^[F:1b5b46:end
0x1b5b48;^[H:1b5b48:home
0x1b5b367e;^[6~:1b5b367e:pagedown
0x1b5b357e;^[5~:1b5b357e:pageup
0x1b5b327e;^[2~:1b5b327e:insert
0x1b5b337e;^[3~:1b5b337e:delete
0x1b5b327e;^[2~:1b5b327e:insert
0x1b5b48;^[H:1b5b48:home
0x1b5b357e;^[5~:1b5b357e:pageup
0x1b5b337e;^[3~:1b5b337e:delete
0x1b5b46;^[F:1b5b46:end
0x1b5b367e;^[6~:1b5b367e:pagedown

    0x10;^PDLE:10: application
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
