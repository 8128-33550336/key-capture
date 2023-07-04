import { getKeyEmitter } from "./key";
import { getCapture } from "./term";
export const createCapture = <T extends true | undefined | false>(doKeyEmit?: T, autoExit: boolean = true): (typeof doKeyEmit extends undefined ? ReturnType<typeof getKeyEmitter> : true extends T ? ReturnType<typeof getKeyEmitter> : ReturnType<typeof getCapture>) => {
    if (doKeyEmit) {
        const capture = getCapture();
        const keyEmitter = getKeyEmitter();

        if (autoExit) {
            keyEmitter.extendSequence.detectSequence(['Control.C', 'Control.C'], () => {
                process.exit(0);
            });
        }

        return {
            keyEventEmitter: keyEmitter.keyEventEmitter,
            extendSequence: keyEmitter.extendSequence,
            start() {
                keyEmitter.start();
                capture.start();
            },
            stop() {
                keyEmitter.stop();
                capture.stop();
            },
            getIsCapturing: capture.getIsCapturing
        } as any;
        // Could you please tell me the best solution?
    } else {
        const capture = getCapture();

        return capture as any;
    }
};
