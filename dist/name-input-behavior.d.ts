import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";
export declare class NameInputBindingBehavior extends InputBehaviorBase {
    onPaste(pasteEvent: any, context: BindingContext): void;
    onKeyDown(keyEvent: any, context: BindingContext): void;
    isValidCharacter(c: any): boolean;
}
