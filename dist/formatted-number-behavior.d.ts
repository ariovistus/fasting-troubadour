import { Binding, Scope } from "aurelia-binding";
import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";
export declare class FormattedNumberBindingBehavior extends InputBehaviorBase {
    private formatter;
    private formatName;
    private maxName;
    private minName;
    constructor();
    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext): void;
    private isOutOfRange(val, context);
    onBlur(blurEvent: any, context: BindingContext): void;
    onPaste(pasteEvent: any, context: BindingContext): void;
    bind(binding: Binding, scope: Scope, format?: string, min?: number, max?: number): void;
    private formatValue(context);
    private cropValue(context);
}
