"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var input_behavior_base_1 = require("./input-behavior-base");
var CustomCharsInputBindingBehavior = (function (_super) {
    __extends(CustomCharsInputBindingBehavior, _super);
    function CustomCharsInputBindingBehavior() {
        var _this = _super.call(this) || this;
        _this.regexName = _this.makeName("c_regex");
        return _this;
    }
    CustomCharsInputBindingBehavior.prototype.onPaste = function (pasteEvent, context) {
        var _this = this;
        setTimeout(function () {
            _this.valueFixup(context, function (c) { return _this.isValidCharacter(context, c); });
        }, 0);
    };
    CustomCharsInputBindingBehavior.prototype.onKeyDown = function (keyEvent, context) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        if (!this.isValidCharacter(context, keyEvent.key)) {
            keyEvent.preventDefault();
        }
    };
    CustomCharsInputBindingBehavior.prototype.isValidCharacter = function (context, c) {
        var regex = context.binding[this.regexName];
        return (regex.test(c));
    };
    CustomCharsInputBindingBehavior.prototype.bind = function (binding, scope, regex) {
        if (regex === void 0) { regex = null; }
        _super.prototype.bind.call(this, binding, scope);
        if (regex == null) {
            throw new Error("customCharsInput requires a regular expression parameter");
        }
        if (typeof (regex) == 'string') {
            regex = new RegExp(regex);
        }
        binding[this.regexName] = regex;
    };
    return CustomCharsInputBindingBehavior;
}(input_behavior_base_1.InputBehaviorBase));
exports.CustomCharsInputBindingBehavior = CustomCharsInputBindingBehavior;
//# sourceMappingURL=custom-chars-input-behavior.js.map