import { TypedEventEmitter } from "@8128-33550336/typedeventemitter";
import { SequenceDescriptor, detectSequenceType, keyEvents } from "./key";


export function functionKeyRegister(keyEventEmitter: TypedEventEmitter<keyEvents>, detectSequence: detectSequenceType, CSI: SequenceDescriptor, SS3: SequenceDescriptor) {
    const F1 = detectSequence([SS3, 0x50], (codePoints) => {
        // PF1
        keyEventEmitter.emit('f1', 'f1', codePoints);
        keyEventEmitter.emit('keydown', 'f1', codePoints, 'f1');
    });
    const F2 = detectSequence([SS3, 0x51], (codePoints) => {
        keyEventEmitter.emit('f2', 'f2', codePoints);
        keyEventEmitter.emit('keydown', 'f2', codePoints, 'f2');
    });
    const F3 = detectSequence([SS3, 0x52], (codePoints) => {
        keyEventEmitter.emit('f3', 'f3', codePoints);
        keyEventEmitter.emit('keydown', 'f3', codePoints, 'f3');
    });
    const F4 = detectSequence([SS3, 0x53], (codePoints) => {
        keyEventEmitter.emit('f4', 'f4', codePoints);
        keyEventEmitter.emit('keydown', 'f4', codePoints, 'f4');
    });

    detectSequence([CSI, '1', '1', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f1', 'f1', codePoints);
        keyEventEmitter.emit('keydown', 'f1', codePoints, 'f1');
    });
    detectSequence([CSI, '1', '2', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f2', 'f2', codePoints);
        keyEventEmitter.emit('keydown', 'f2', codePoints, 'f2');
    });
    detectSequence([CSI, '1', '3', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f3', 'f3', codePoints);
        keyEventEmitter.emit('keydown', 'f3', codePoints, 'f3');
    });
    detectSequence([CSI, '1', '4', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f4', 'f4', codePoints);
        keyEventEmitter.emit('keydown', 'f4', codePoints, 'f4');
    });

    const F5 = detectSequence([CSI, '1', '5', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f5', 'f5', codePoints);
        keyEventEmitter.emit('keydown', 'f5', codePoints, 'f5');
    });
    const F6 = detectSequence([CSI, '1', '7', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f6', 'f6', codePoints);
        keyEventEmitter.emit('keydown', 'f6', codePoints, 'f6');
    });
    const F7 = detectSequence([CSI, '1', '8', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f7', 'f7', codePoints);
        keyEventEmitter.emit('keydown', 'f7', codePoints, 'f7');
    });
    const F8 = detectSequence([CSI, '1', '9', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f8', 'f8', codePoints);
        keyEventEmitter.emit('keydown', 'f8', codePoints, 'f8');
    });
    const F9 = detectSequence([CSI, '2', '0', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f9', 'f9', codePoints);
        keyEventEmitter.emit('keydown', 'f9', codePoints, 'f9');
    });
    const F10 = detectSequence([CSI, '2', '1', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f10', 'f10', codePoints);
        keyEventEmitter.emit('keydown', 'f10', codePoints, 'f10');
    });
    const F11 = detectSequence([CSI, '2', '3', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f11', 'f11', codePoints);
        keyEventEmitter.emit('keydown', 'f11', codePoints, 'f11');
    });
    const F12 = detectSequence([CSI, '2', '4', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f12', 'f12', codePoints);
        keyEventEmitter.emit('keydown', 'f12', codePoints, 'f12');
    });
    const F13 = detectSequence([CSI, '2', '5', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f13', 'f13', codePoints);
        keyEventEmitter.emit('keydown', 'f13', codePoints, 'f13');
    });
    const F14 = detectSequence([CSI, '2', '6', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f14', 'f14', codePoints);
        keyEventEmitter.emit('keydown', 'f14', codePoints, 'f14');
    });
    const F15 = detectSequence([CSI, '2', '8', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f15', 'f15', codePoints);
        keyEventEmitter.emit('keydown', 'f15', codePoints, 'f15');
    });
    const F16 = detectSequence([CSI, '2', '9', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f16', 'f16', codePoints);
        keyEventEmitter.emit('keydown', 'f16', codePoints, 'f16');
    });
    const F17 = detectSequence([CSI, '3', '1', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f17', 'f17', codePoints);
        keyEventEmitter.emit('keydown', 'f17', codePoints, 'f17');
    });
    const F18 = detectSequence([CSI, '3', '2', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f18', 'f18', codePoints);
        keyEventEmitter.emit('keydown', 'f18', codePoints, 'f18');
    });
    const F19 = detectSequence([CSI, '3', '3', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f19', 'f19', codePoints);
        keyEventEmitter.emit('keydown', 'f19', codePoints, 'f19');
    });
    const F20 = detectSequence([CSI, '3', '4', 0x7e], (codePoints) => {
        keyEventEmitter.emit('f20', 'f20', codePoints);
        keyEventEmitter.emit('keydown', 'f20', codePoints, 'f20');
    });

    const ShiftFunc1234Prefix = detectSequence([CSI, '1', ';', '2']);
    const ShiftF1 = detectSequence([ShiftFunc1234Prefix, 0x50], (codePoints) => {
        keyEventEmitter.emit('shift.f1', 'shift.f1', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f1', codePoints, 'shift.f1');
    });
    const ShiftF2 = detectSequence([ShiftFunc1234Prefix, 0x51], (codePoints) => {
        keyEventEmitter.emit('shift.f2', 'shift.f2', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f2', codePoints, 'shift.f2');
    });
    const ShiftF3 = detectSequence([ShiftFunc1234Prefix, 0x52], (codePoints) => {
        keyEventEmitter.emit('shift.f3', 'shift.f3', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f3', codePoints, 'shift.f3');
    });
    const ShiftF4 = detectSequence([ShiftFunc1234Prefix, 0x53], (codePoints) => {
        keyEventEmitter.emit('shift.f4', 'shift.f4', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f4', codePoints, 'shift.f4');
    });

    const ShiftFunc5Postfix = detectSequence([';', '2', 0x7e]);
    const ShiftF5 = detectSequence([CSI, '1', '5', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f5', 'shift.f5', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f5', codePoints, 'shift.f5');
    });
    const ShiftF6 = detectSequence([CSI, '1', '7', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f6', 'shift.f6', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f6', codePoints, 'shift.f6');
    });
    const ShiftF7 = detectSequence([CSI, '1', '8', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f7', 'shift.f7', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f7', codePoints, 'shift.f7');
    });
    const ShiftF8 = detectSequence([CSI, '1', '9', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f8', 'shift.f8', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f8', codePoints, 'shift.f8');
    });
    const ShiftF9 = detectSequence([CSI, '2', '0', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f9', 'shift.f9', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f9', codePoints, 'shift.f9');
    });
    const ShiftF10 = detectSequence([CSI, '2', '1', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f10', 'shift.f10', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f10', codePoints, 'shift.f10');
    });
    const ShiftF11 = detectSequence([CSI, '2', '3', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f11', 'shift.f11', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f11', codePoints, 'shift.f11');
    });
    const ShiftF12 = detectSequence([CSI, '2', '4', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f12', 'shift.f12', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f12', codePoints, 'shift.f12');
    });
    const ShiftF13 = detectSequence([CSI, '2', '5', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f13', 'shift.f13', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f13', codePoints, 'shift.f13');
    });
    const ShiftF14 = detectSequence([CSI, '2', '6', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f14', 'shift.f14', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f14', codePoints, 'shift.f14');
    });
    const ShiftF15 = detectSequence([CSI, '2', '8', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f15', 'shift.f15', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f15', codePoints, 'shift.f15');
    });
    const ShiftF16 = detectSequence([CSI, '2', '9', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f16', 'shift.f16', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f16', codePoints, 'shift.f16');
    });
    const ShiftF17 = detectSequence([CSI, '3', '1', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f17', 'shift.f17', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f17', codePoints, 'shift.f17');
    });
    const ShiftF18 = detectSequence([CSI, '3', '2', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f18', 'shift.f18', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f18', codePoints, 'shift.f18');
    });
    const ShiftF19 = detectSequence([CSI, '3', '3', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f19', 'shift.f19', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f19', codePoints, 'shift.f19');
    });
    const ShiftF20 = detectSequence([CSI, '3', '4', ShiftFunc5Postfix], (codePoints) => {
        keyEventEmitter.emit('shift.f20', 'shift.f20', codePoints);
        keyEventEmitter.emit('keydown', 'shift.f20', codePoints, 'shift.f20');
    });
    return {
        F1, F2, F3, F4, F5, F6,
        F7, F8, F9, F10, F11, F12,
        F13, F14, F15, F16, F17, F18,
        F19, F20,
        ShiftF1, ShiftF2, ShiftF3, ShiftF4, ShiftF5, ShiftF6,
        ShiftF7, ShiftF8, ShiftF9, ShiftF10, ShiftF11, ShiftF12,
        ShiftF13, ShiftF14, ShiftF15, ShiftF16, ShiftF17, ShiftF18,
        ShiftF19, ShiftF20,
    };
} 
