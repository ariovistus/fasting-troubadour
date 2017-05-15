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
var TrimBindingBehavior = (function (_super) {
    __extends(TrimBindingBehavior, _super);
    function TrimBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrimBindingBehavior.prototype.onPaste = function (pasteEvent, context) {
        var _this = this;
        setTimeout(function () { return _this.trimValue(context); }, 0);
    };
    TrimBindingBehavior.prototype.onBlur = function (blurEvent, context) {
        this.trimValue(context);
    };
    TrimBindingBehavior.prototype.trimValue = function (context) {
        var value = context.value();
        if (value != null && typeof value === 'string' && value.trim() !== value) {
            var trimmed = value.trim();
            context.binding.updateSource(trimmed);
            context.binding.updateTarget(trimmed);
        }
    };
    return TrimBindingBehavior;
}(input_behavior_base_1.InputBehaviorBase));
exports.TrimBindingBehavior = TrimBindingBehavior;
//# sourceMappingURL=trim-binding-behavior.js.map