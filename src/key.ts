import { TypedEventEmitter, eventEmitterLogger, eventTypedAddListener } from "@8128-33550336/typedeventemitter";
import { functionKeyRegister } from "./functionKeys";
import EventEmitter from "events";

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

type functionKeyTypes = { [P in
    'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' |
    'f7' | 'f8' | 'f9' | 'f10' | 'f11' | 'f12' |
    'f13' | 'f14' | 'f15' | 'f16' | 'f17' | 'f18' |
    'f19' | 'f20'
    ]: [name: P, codePoint: number[]] };
type shiftFunctionKeyTypes = { [P in
    'shift.f1' | 'shift.f2' | 'shift.f3' | 'shift.f4' | 'shift.f5' | 'shift.f6' |
    'shift.f7' | 'shift.f8' | 'shift.f9' | 'shift.f10' | 'shift.f11' | 'shift.f12' |
    'shift.f13' | 'shift.f14' | 'shift.f15' | 'shift.f16' | 'shift.f17' | 'shift.f18' |
    'shift.f19' | 'shift.f20'
    ]: [name: P, codePoint: number[]] };

type pageKey = { [P in 'Home' | 'End' | 'PageUp' | 'PageDown' | 'Insert' | 'DeleteKey' | 'Find' | 'Select']: [name: P, codePoint: number[]] };

type ascii0x40ControlTypes = { [P in `Control.${typeof ascii0x40[number]}`]: [name: P, codePoint: number] };

type ascii0x50ControlTypes = { [P in `Control.${typeof ascii0x50[number]}`]: [name: P, codePoint: number] };
type noShiftFirstHalfCaseTypes = { [P in Lowercase<typeof noShiftFirstHalf[number]>]: [name: P, codePoint: number] };
type noShiftSecondHalfCaseTypes = { [P in Lowercase<typeof noShiftSecondHalf[number]>]: [name: P, codePoint: number] };

type arrowTypes = { [P in 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight']: [name: P, codePoint: number[]] };
type sequenceType = { [P in 'CSI' | 'SS3']: [name: P, codePoint: number[]] };

type specialKeyTypes = { [P in 'Backspace' | 'Escape' | 'Enter' | 'Tab' | 'Delete' | 'Space' | 'MenuKey']: [name: P, codePoint: number] };

type aByteCharType =
    ascii0x40ControlTypes & ascii0x50ControlTypes &
    specialKeyTypes &
    noShiftFirstHalfCaseTypes & noShiftSecondHalfCaseTypes;

type specialKeys = aByteCharType &
    arrowTypes &
    sequenceType &
    functionKeyTypes &
    shiftFunctionKeyTypes &
    pageKey;
export type keyEvents = specialKeys & {
    keydown: [
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
    keydownSequence: [
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

export type detectSequenceType = (events: recursionEvents, callback?: ((codePoints: number[]) => void)) => SequenceDescriptor;

export interface SequenceDescriptor {
    events: depth0[];
    listen(callback: (codePoints: number[]) => void): this;
}

export function createKeyEmit(option?: keyEmitOpt) {
    const keyEventEmitter = new TypedEventEmitter<keyEvents>();

    // sequence 2 (CSI, SS3), Arrow 4, Edit 8, func 40, hidden 1 + 9
    (keyEventEmitter as EventEmitter).setMaxListeners(64);

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
                        case 0x10: {
                            keyEventEmitter.emit('MenuKey', 'MenuKey', codePoint);
                            emittedEvent = 'MenuKey';
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

            keyEventEmitter.emit('keydown', readingChar.value, codePoint, emittedEvent, asciiInfo);
            keyEventEmitter.emit('keydownSequence', readingChar.value, codePoint, emittedEvent, asciiInfo);

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

                keyEventEmitter.on('keydown', (name, codePoint, specialName, ascii) => {
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
        if (callback) {
            descriptor.listen(callback);
        }
        return descriptor;
    };

    const CSI = detectSequence(['Escape', '['], (codePoints) => {
        keyEventEmitter.emit('CSI', 'CSI', codePoints);
        keyEventEmitter.emit('keydownSequence', 'CSI', codePoints, 'CSI');
    });

    const ArrowUp = detectSequence([CSI, (c) => c === 'A'], (codePoints) => {
        keyEventEmitter.emit('ArrowUp', 'ArrowUp', codePoints);
        keyEventEmitter.emit('keydownSequence', 'ArrowUp', codePoints, 'ArrowUp');
    });

    const ArrowDown = detectSequence([CSI, (c) => c === 'B'], (codePoints) => {
        keyEventEmitter.emit('ArrowDown', 'ArrowDown', codePoints);
        keyEventEmitter.emit('keydownSequence', 'ArrowDown', codePoints, 'ArrowDown');
    });

    const ArrowRight = detectSequence([CSI, (c) => c === 'C'], (codePoints) => {
        keyEventEmitter.emit('ArrowRight', 'ArrowRight', codePoints);
        keyEventEmitter.emit('keydownSequence', 'ArrowRight', codePoints, 'ArrowRight');
    });

    const ArrowLeft = detectSequence([CSI, (c) => c === 'D'], (codePoints) => {
        keyEventEmitter.emit('ArrowLeft', 'ArrowLeft', codePoints);
        keyEventEmitter.emit('keydownSequence', 'ArrowLeft', codePoints, 'ArrowLeft');
    });


    const Konami = detectSequence([ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, 'a', 'b']);

    const SS3 = detectSequence(['Escape', 0x4f], (codePoints) => {
        keyEventEmitter.emit('SS3', 'SS3', codePoints);
        keyEventEmitter.emit('keydownSequence', 'SS3', codePoints, 'SS3');
    });

    const Home = detectSequence([CSI, 0x48], (codePoints) => {
        keyEventEmitter.emit('Home', 'Home', codePoints);
        keyEventEmitter.emit('keydownSequence', 'Home', codePoints, 'Home');
    });
    const End = detectSequence([CSI, 0x46], (codePoints) => {
        keyEventEmitter.emit('End', 'End', codePoints);
        keyEventEmitter.emit('keydownSequence', 'End', codePoints, 'End');
    });
    const Find = detectSequence([CSI, '1', 0x7e], (codePoints) => {
        keyEventEmitter.emit('Find', 'Find', codePoints);
        keyEventEmitter.emit('keydownSequence', 'Find', codePoints, 'Find');
    });
    const Insert = detectSequence([CSI, '2', 0x7e], (codePoints) => {
        keyEventEmitter.emit('Insert', 'Insert', codePoints);
        keyEventEmitter.emit('keydownSequence', 'Insert', codePoints, 'Insert');
    });
    const DeleteKey = detectSequence([CSI, '3', 0x7e], (codePoints) => {
        keyEventEmitter.emit('DeleteKey', 'DeleteKey', codePoints);
        keyEventEmitter.emit('keydownSequence', 'DeleteKey', codePoints, 'DeleteKey');
    });
    const Select = detectSequence([CSI, '4', 0x7e], (codePoints) => {
        keyEventEmitter.emit('Select', 'Select', codePoints);
        keyEventEmitter.emit('keydownSequence', 'Select', codePoints, 'Select');
    });
    const PageUp = detectSequence([CSI, '5', 0x7e], (codePoints) => {
        keyEventEmitter.emit('PageUp', 'PageUp', codePoints);
        keyEventEmitter.emit('keydownSequence', 'PageUp', codePoints, 'PageUp');
    });
    const PageDown = detectSequence([CSI, '6', 0x7e], (codePoints) => {
        keyEventEmitter.emit('PageDown', 'PageDown', codePoints);
        keyEventEmitter.emit('keydownSequence', 'PageDown', codePoints, 'PageDown');
    });

    const specialKeys = {
        CSI,
        SS3,
        ArrowUp,
        ArrowDown,
        ArrowRight,
        ArrowLeft,
        Insert, Home, PageUp,
        DeleteKey, End, PageDown,
        Find, Select,
        functionKeys: functionKeyRegister(keyEventEmitter, detectSequence, CSI, SS3)
    };

    // hide Konami
    (specialKeys as any).Konami = Konami;

    let isListening = false;
    return {
        keyEventEmitter: keyEventEmitter as eventTypedAddListener<keyEvents>,
        extendSequence: {
            detectSequence,
            specialKeys: specialKeys
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
