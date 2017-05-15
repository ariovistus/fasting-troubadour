import { Binding, Scope } from "aurelia-binding";
export declare class BindingContext {
    binding: Binding;
    scope: Scope;
    value(): any;
    cursorAtStart(): boolean;
}
