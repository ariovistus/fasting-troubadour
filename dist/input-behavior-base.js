"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binding_context_1 = require("./binding-context");
var InputBehaviorBase = (function () {
    function InputBehaviorBase() {
        this.keyDownName = this.makeName("keydown");
        this.blurName = this.makeName("blur");
        this.pasteName = this.makeName("paste");
    }
    InputBehaviorBase.prototype.makeName = function (nom) {
        return "_" + this.constructor['name'] + "_" + nom;
    };
    InputBehaviorBase.prototype.onKeyDown = function (keyEvent, context) {
    };
    InputBehaviorBase.prototype.onBlur = function (blurEvent, context) {
    };
    InputBehaviorBase.prototype.onPaste = function (pasteEvent, context) {
    };
    InputBehaviorBase.prototype.keyDownStandardAllowed = function (keyEvent) {
        if ([46, 8, 9, 27, 13, 110].findIndex(function (x) { return x === keyEvent.keyCode; }) !== -1) {
            return true;
        }
        if ((keyEvent.keyCode == 65 && keyEvent.ctrlKey === true) ||
            (keyEvent.keyCode == 67 && keyEvent.ctrlKey === true) ||
            (keyEvent.keyCode == 88 && keyEvent.ctrlKey === true) ||
            (keyEvent.keyCode == 86 && keyEvent.ctrlKey === true) ||
            (keyEvent.keyCode >= 35 && keyEvent.keyCode <= 39)) {
            return true;
        }
        return false;
    };
    InputBehaviorBase.prototype.valueFixup = function (context, isValid) {
        var value = context.value() || "";
        var state = {};
        var newValue = "";
        for (var i = 0; i < value.length; i++) {
            if (isValid(value[i], i, value, state)) {
                newValue += value[i];
            }
        }
        context.binding.updateSource(newValue);
        context.binding.updateTarget(newValue);
    };
    InputBehaviorBase.prototype.bind = function (binding, scope) {
        var _this = this;
        var context = new binding_context_1.BindingContext();
        context.binding = binding;
        context.scope = scope;
        binding[this.keyDownName] = function (keyEvent) {
            _this.onKeyDown(keyEvent, context);
        };
        binding['target'].addEventListener('keydown', binding[this.keyDownName]);
        binding[this.pasteName] = function (pasteEvent) {
            _this.onPaste(pasteEvent, context);
        };
        binding['target'].addEventListener('paste', binding[this.pasteName]);
        binding[this.blurName] = function (blurEvent) {
            _this.onBlur(blurEvent, context);
        };
        binding['target'].addEventListener('blur', binding[this.blurName]);
    };
    InputBehaviorBase.prototype.unbind = function (binding, scope) {
        if (this.keyDownName in binding) {
            binding['target'].removeEventListener('keydown', binding[this.keyDownName]);
        }
        if (this.blurName in binding) {
            binding['target'].removeEventListener('blur', binding[this.blurName]);
        }
        if (this.pasteName in binding) {
            binding['target'].removeEventListener('paste', binding[this.pasteName]);
        }
    };
    return InputBehaviorBase;
}());
exports.InputBehaviorBase = InputBehaviorBase;
//# sourceMappingURL=input-behavior-base.js.map