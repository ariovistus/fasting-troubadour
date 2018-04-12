import {Binding, Scope} from "aurelia-binding";

export class BindingContext {
    binding: Binding;
    scope: Scope;

    value() {
        if(this.scope.bindingContext == null) {
            // ??
            return "";
        }
        let _value = this.binding.sourceExpression['expression'].evaluate(this.scope, null);
        if(_value == null) {
            return "";
        }

        return _value;
    }

    cursorAtStart() {
        return this.binding['target'].selectionStart == 0;
    }
}
