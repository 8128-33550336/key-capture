import { getKeyEmitter } from "./key";
import { getCapture } from "./term";
export const createCapture = (doKeyEmit: boolean = true) => {
    if (doKeyEmit) {
        const capture = getCapture();
        const keyEmitter = getKeyEmitter();

        keyEmitter.extendSequence.detectSequence(['Control.C', 'Control.C'], () => {
            console.log('exit');
            process.exit(0);
        });

        return {
            keyEventEmitter: keyEmitter.keyEventEmitter,
            extendSequence: keyEmitter.extendSequence,
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
