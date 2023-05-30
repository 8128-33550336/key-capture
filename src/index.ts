import { getKeyEmitter } from "./key";
import { getCapture } from "./term";
export const createCapture = <T extends true | false = true>(doKeyEmit?: T extends true ? true | undefined : false, autoExit: boolean = true): (T extends true ? {
    keyEventEmitter: ReturnType<typeof getKeyEmitter>['keyEventEmitter'],
    extendSequence: ReturnType<typeof getKeyEmitter>['extendSequence'],
    start(): void,
    stop(): void,
    getIsCapturing(): boolean;
} : {
    start(): void,
    stop(): void,
    getIsCapturing(): boolean;
}) => {
    if (doKeyEmit) {
        const capture = getCapture();
        const keyEmitter = getKeyEmitter();

        if (autoExit) {
            keyEmitter.extendSequence.detectSequence(['Control.C', 'Control.C'], () => {
                console.log('exit');
                process.exit(0);
            });
        }

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
        } as any;

    } else {
        const capture = getCapture();

        return capture as any;
    }
};
