import { TypedEventEmitter, eventEmitterLogger, eventTypedAddListener } from "@8128-33550336/typedeventemitter";

const ascii0x40 = [
    '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
] as const;
const ascii0x50 = [
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
] as const;

const noShiftFirstHalf = [
    ',', '-', '.', '/', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', ':', ';',
    '@', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
] as const;
const noShiftSecondHalf = [
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    'x', 'y', 'z', '[', '\\', ']', '^', '_'
] as const;

const functionKey = [
    'f1', 'f2',
] as const

type ascii0x40ControlTypes = { [P in typeof ascii0x40 extends readonly (infer T extends string)[] ? `Control.${T}` : never]: [name: P, codePoint: number] };

type ascii0x50ControlTypes = { [P in typeof ascii0x50 extends readonly (infer T extends string)[] ? `Control.${T}` : never]: [name: P, codePoint: number] };
type noShiftFirstHalfCaseTypes = { [P in typeof noShiftFirstHalf extends readonly (infer T extends string)[] ? Lowercase<T> : never]: [name: P, codePoint: number] };
type noShiftSecondHalfCaseTypes = { [P in typeof noShiftSecondHalf extends readonly (infer T extends string)[] ? Lowercase<T> : never]: [name: P, codePoint: number] };

type arrowTypes = { [P in 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight']: [name: P, codePoint: number[]] };
type sequenceType = { [P in 'CSI' | 'DeleteKey']: [name: P, codePoint: number[]] };

type specialKeyTypes = { [P in 'Backspace' | 'Escape' | 'Enter' | 'Tab' | 'Delete' | 'Space']: [name: P, codePoint: number] };

type aByteCharType =
    ascii0x40ControlTypes & ascii0x50ControlTypes &
    specialKeyTypes &
    noShiftFirstHalfCaseTypes & noShiftSecondHalfCaseTypes;

type specialKeys = aByteCharType &
    arrowTypes &
    sequenceType;
type keyEvents = specialKeys & {
    aByteKeyDown: [
        name: string,
        codePoint: number,
        keySpecialName: (keyof aByteCharType) | null,
        ascii?: {
            control?: {
                withoutControl: string;
            };
            isPrintable: boolean,
            isDelete: boolean,
        },
    ];
    keydown: [
        name: string,
        codePoint: number | number[],
        keySpecialName: (keyof specialKeys) | null,
        ascii?: {
            control?: {
                withoutControl: string;
            };
            isPrintable: boolean,
            isDelete: boolean,
        },
    ];
};
interface keyEmitOpt {
}
type depth0 = ((keyof aByteCharType) | SequenceDescriptor | number | ((
    name: string,
    codePoint: number,
    keySpecialName: (keyof aByteCharType) | null,
    ascii?: {
        control?: {
            withoutControl: string;
        };
        isPrintable: boolean,
        isDelete: boolean,
    },
) => boolean));
type recursionEvents = readonly (depth0 | recursionEvents)[];

export interface SequenceDescriptor {
    events: depth0[];
    listen(callback: (codePoints: number[]) => void): this;
}

export function createKeyEmit(option?: keyEmitOpt) {
    const keyEventEmitter = new TypedEventEmitter<keyEvents>();
    const listener = (chunk: Buffer) => {
        const str = chunk.toString('utf8');
        const stringIterator = str[Symbol.iterator]();
        let readingChar = stringIterator.next();
        while (!readingChar.done) {
            const codePoint = readingChar.value.codePointAt(0);
            if (codePoint === undefined) {
                continue;
            }
            let asciiInfo: {
                control?: {
                    withoutControl: string;
                };
                isPrintable: boolean,
                isDelete: boolean,
            } | undefined = undefined;
            let emittedEvent: keyof keyEvents | null = null;
            if (codePoint < 0x80) {
                if (codePoint < 0x20) {
                    switch (codePoint) {
                        case 0x08: {
                            keyEventEmitter.emit('Backspace', 'Backspace', codePoint);
                            emittedEvent = 'Backspace';
                            break;
                        }
                        case 0x09: {
                            keyEventEmitter.emit('Tab', 'Tab', codePoint);
                            emittedEvent = 'Tab';
                            break;
                        }
                        case 0x0d: {
                            keyEventEmitter.emit('Enter', 'Enter', codePoint);
                            emittedEvent = 'Enter';
                            break;
                        }
                        case 0x1b: {
                            keyEventEmitter.emit('Escape', 'Escape', codePoint);
                            emittedEvent = 'Escape';
                            break;
                        }
                    }

                    // TypeScript の 26 の壁によりこうして分けて回避している。
                    (() => {
                        if (codePoint < 0x10) {
                            const controlCode = ascii0x40[codePoint];
                            if (controlCode === undefined) {
                                return;
                            }
                            const ctrlEventName: keyof ascii0x40ControlTypes = `Control.${controlCode}`;
                            keyEventEmitter.emit(ctrlEventName, ctrlEventName, codePoint);
                            emittedEvent ??= ctrlEventName;

                            asciiInfo = { control: { withoutControl: controlCode }, isPrintable: false, isDelete: false };
                        } else {
                            const controlCode = ascii0x50[codePoint - 0x10];
                            if (controlCode === undefined) {
                                return;
                            }
                            const ctrlEventName: keyof ascii0x50ControlTypes = `Control.${controlCode}`;
                            keyEventEmitter.emit(ctrlEventName, ctrlEventName, codePoint);
                            emittedEvent ??= ctrlEventName;

                            asciiInfo = { control: { withoutControl: controlCode }, isPrintable: false, isDelete: false };
                        }
                    })();
                } else if (codePoint < 0x7f) {
                    if (codePoint === 0x20) {
                        keyEventEmitter.emit('Space', 'Space', codePoint);
                        emittedEvent = 'Space';
                    }
                    if ([...noShiftFirstHalf, ...noShiftSecondHalf, ''].includes(readingChar.value)) {
                        if ([...noShiftFirstHalf, ''].includes(readingChar.value)) {
                            const char = readingChar.value as keyof noShiftFirstHalfCaseTypes;

                            keyEventEmitter.emit(char, char, codePoint);
                            emittedEvent ??= char;
                        }
                        if ([...noShiftSecondHalf, ''].includes(readingChar.value)) {
                            const char = readingChar.value as keyof noShiftSecondHalfCaseTypes;

                            keyEventEmitter.emit(char, char, codePoint);
                            emittedEvent ??= char;
                        }
                    }
                    asciiInfo = { isPrintable: true, isDelete: false };

                } else {
                    keyEventEmitter.emit('Delete', 'Delete', codePoint);
                    emittedEvent = 'Delete';
                    asciiInfo = { isPrintable: false, isDelete: true };
                }
            } else {
            }

            keyEventEmitter.emit('aByteKeyDown', readingChar.value, codePoint, emittedEvent, asciiInfo);

            readingChar = stringIterator.next();
        }
    };

    const detectSequence = (
        events: recursionEvents,
        callback?: (codePoints: number[]) => void): SequenceDescriptor => {

        const flattedEvents = (function func(ev): Exclude<depth0, SequenceDescriptor>[] {
            const isFlatArray = ev.every(v => typeof v !== 'object');
            if (isFlatArray) {
                return ev as Exclude<depth0, SequenceDescriptor>[];
            }
            const flatted = (ev.flat(Infinity as 1) as depth0[]);
            const seqDec = flatted.map(v => typeof v === 'object' ? v.events : v);
            return func(seqDec);
        })(events);

        if (flattedEvents.length === 0) {
            throw new Error('Array length must be greater than or equal to 1.');
        }
        const descriptor: SequenceDescriptor = {
            events: flattedEvents,
            listen(innerCallback) {
                let codePoints: number[] = [];

                keyEventEmitter.on('aByteKeyDown', (name, codePoint, specialName, ascii) => {
                    const event = flattedEvents[codePoints.length];
                    const match = (() => {
                        if (event === undefined) {
                            return false;
                        }
                        if (typeof event === 'function') {
                            return event(name, codePoint, specialName, ascii);
                        } else if (typeof event === 'number') {
                            return codePoint === event;
                        } else {
                            return specialName === event;
                        }
                    })();
                    if (match) {
                        codePoints.push(codePoint);
                        if (codePoints.length === flattedEvents.length) {
                            innerCallback(codePoints);
                            codePoints = [];
                        }
                    } else {
                        codePoints = [];
                    }
                });

                return descriptor;
            },
        };
        if (callback === undefined) {
            return descriptor;
        }
        descriptor.listen(callback);
        return descriptor;
    };

    const CSI = detectSequence(['Escape', '['], (codePoints) => {
        keyEventEmitter.emit('CSI', 'CSI', codePoints);
    });

    const ArrowUp = detectSequence([CSI, (c) => c === 'A'], (codePoints) => {
        keyEventEmitter.emit('ArrowUp', 'ArrowUp', codePoints);
    });

    const ArrowDown = detectSequence([CSI, (c) => c === 'B'], (codePoints) => {
        keyEventEmitter.emit('ArrowDown', 'ArrowDown', codePoints);
    });

    const ArrowRight = detectSequence([CSI, (c) => c === 'C'], (codePoints) => {
        keyEventEmitter.emit('ArrowRight', 'ArrowRight', codePoints);
    });

    const ArrowLeft = detectSequence([CSI, (c) => c === 'D'], (codePoints) => {
        keyEventEmitter.emit('ArrowLeft', 'ArrowLeft', codePoints);
    });

    const DeleteKey = detectSequence([CSI, '3', 0x37], (codePoints) => {
        keyEventEmitter.emit('DeleteKey', 'DeleteKey', codePoints);
    });

    const Konami = detectSequence([ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, 'a', 'b'], (codePoints) => {
        console.log('exit');
        process.exit(0);
    });

    let isListening = false;
    return {
        keyEventEmitter: keyEventEmitter as eventTypedAddListener<keyEvents>,
        extendSequence: {
            detectSequence,
            CSI,
            ArrowUp,
            ArrowDown,
            ArrowRight,
            ArrowLeft,
            DeleteKey,
            Konami,
        },
        start: () => {
            if (isListening) {
                return;
            }
            isListening = true;
            process.stdin.on('data', listener);
        },
        stop: () => {
            if (!isListening) {
                return;
            }
            isListening = false;
            process.stdin.off('data', listener);
        },
        getIsCapturing: () => isListening
    };
};

const keyEmitSingleton = createKeyEmit();
export const getKeyEmitter = () => keyEmitSingleton;
