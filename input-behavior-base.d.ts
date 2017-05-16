import { Binding, Scope } from "aurelia-binding";
import { BindingContext } from "./binding-context";
export declare class InputBehaviorBase {
    keyDownName: string;
    blurName: string;
    pasteName: string;
    constructor();
    protected makeName(nom: string): string;
    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext): void;
    onBlur(blurEvent: Event, context: BindingContext): void;
    onPaste(pasteEvent: Event, context: BindingContext): void;
    keyDownStandardAllowed(keyEvent: KeyboardEvent): boolean;
    valueFixup(context: BindingContext, isValid: Function): void;
    bind(binding: Binding, scope: Scope): void;
    unbind(binding: Binding, scope: Scope): void;
}
