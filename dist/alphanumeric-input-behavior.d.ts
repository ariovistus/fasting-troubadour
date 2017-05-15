import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";
export declare class AlphanumericInputBindingBehavior extends InputBehaviorBase {
    onPaste(pasteEvent: any, context: BindingContext): void;
    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext): void;
    isValidCharacter(c: any): boolean;
}
