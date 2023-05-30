import { getKeyEmitter } from "./key";
import { getCapture } from "./term";
export const createCapture = (doKeyEmit: boolean = true) => {
    if (doKeyEmit) {
        const capture = getCapture();
        const keyEmitter = getKeyEmitter();

        return {
            keyEventEmitter: keyEmitter.keyEventEmitter,
            start() {
                console.log('start');
                keyEmitter.start();
                capture.start();
            },
            stop() {
                console.log('stop');
                keyEmitter.stop();
                capture.stop();
            },
            getIsCapturing: capture.getIsCapturing
        };

    } else {
        const capture = getCapture();

        return capture;
    }
};

createCapture(true).start();
