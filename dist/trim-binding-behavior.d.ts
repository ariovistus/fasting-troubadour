import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";
export declare class TrimBindingBehavior extends InputBehaviorBase {
    onPaste(pasteEvent: any, context: BindingContext): void;
    onBlur(blurEvent: any, context: BindingContext): void;
    trimValue(context: any): void;
}
