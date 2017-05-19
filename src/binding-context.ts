import {Binding, Scope} from "aurelia-binding";

export class BindingContext {
    binding: Binding;
    scope: Scope;

    value() {
        if(this.scope.bindingContext == null) {
            // ??
            return "";
        }
        return this.binding.sourceExpression['expression'].evaluate(this.scope, null) || "";
    }

    cursorAtStart() {
        return this.binding['target'].selectionStart == 0;
    }
}
