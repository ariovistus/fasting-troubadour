"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BindingContext = (function () {
    function BindingContext() {
    }
    BindingContext.prototype.value = function () {
        if (this.scope.bindingContext == null) {
            return "";
        }
        return this.binding.sourceExpression['expression'].evaluate(this.scope, null) || "";
    };
    BindingContext.prototype.cursorAtStart = function () {
        return this.binding['target'].selectionStart == 0;
    };
    return BindingContext;
}());
exports.BindingContext = BindingContext;
//# sourceMappingURL=binding-context.js.map