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
var NumericNameInputBindingBehavior = (function (_super) {
    __extends(NumericNameInputBindingBehavior, _super);
    function NumericNameInputBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumericNameInputBindingBehavior.prototype.onPaste = function (pasteEvent, context) {
        var _this = this;
        setTimeout(function () {
            _this.valueFixup(context, _this.isValidCharacter);
        }, 0);
    };
    NumericNameInputBindingBehavior.prototype.onKeyDown = function (keyEvent, context) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        if (!this.isValidCharacter(keyEvent.key)) {
            keyEvent.preventDefault();
        }
    };
    NumericNameInputBindingBehavior.prototype.isValidCharacter = function (c) {
        return (/[a-zA-Z\-' 0-9]/.test(c));
    };
    return NumericNameInputBindingBehavior;
}(input_behavior_base_1.InputBehaviorBase));
exports.NumericNameInputBindingBehavior = NumericNameInputBindingBehavior;
//# sourceMappingURL=numeric-name-input-behavior.js.map