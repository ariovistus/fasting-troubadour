import { InputBehaviorBase } from "./input-behavior-base";
import { Binding, Scope } from "aurelia-binding";
import { BindingContext } from "./binding-context";
export declare class CustomCharsInputBindingBehavior extends InputBehaviorBase {
    regexName: string;
    constructor();
    onPaste(pasteEvent: any, context: BindingContext): void;
    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext): void;
    isValidCharacter(context: BindingContext, c: any): any;
    bind(binding: Binding, scope: Scope, regex?: string | RegExp): void;
}
