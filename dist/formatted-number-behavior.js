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
var number_format_1 = require("./number-format");
var input_behavior_base_1 = require("./input-behavior-base");
var binding_context_1 = require("./binding-context");
var FormattedNumberBindingBehavior = (function (_super) {
    __extends(FormattedNumberBindingBehavior, _super);
    function FormattedNumberBindingBehavior() {
        var _this = _super.call(this) || this;
        _this.formatter = new number_format_1.NumberFormatValueConverter();
        _this.formatName = "_" + _this.constructor['name'] + "_format";
        _this.maxName = "_" + _this.constructor['name'] + "_max";
        _this.minName = "_" + _this.constructor['name'] + "_min";
        return _this;
    }
    FormattedNumberBindingBehavior.prototype.onKeyDown = function (keyEvent, context) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        var value = context.value();
        var dotIndex = value.indexOf(".");
        var selectionStart = context.binding['target'].selectionStart;
        if ((keyEvent.keyCode == 190 && dotIndex === -1)) {
            return;
        }
        if ((keyEvent.keyCode == 189 && value.indexOf("-") === -1 && context.cursorAtStart())) {
            return;
        }
        if ((keyEvent.shiftKey || (keyEvent.keyCode < 48 || keyEvent.keyCode > 57)) && (keyEvent.keyCode < 96 || keyEvent.keyCode > 105)) {
            keyEvent.preventDefault();
        }
        var pattern = context.binding[this.formatName];
        var parts = pattern.split(".");
        if (parts.length > 1) {
            var decimalPlaceCount = parts[parts.length - 1].length;
            var regex = new RegExp("\\d*\\.\\d{" + decimalPlaceCount + "}");
            if (dotIndex !== -1 && selectionStart !== undefined && selectionStart > dotIndex && regex.test(value)) {
                keyEvent.preventDefault();
            }
        }
        if (selectionStart !== undefined) {
            var newValue = value.substr(0, selectionStart) + keyEvent.key + value.substring(selectionStart, value.length);
            var parsedNewValue = parseFloat(newValue);
            if (this.isOutOfRange(newValue, context)) {
                keyEvent.preventDefault();
            }
        }
    };
    FormattedNumberBindingBehavior.prototype.isOutOfRange = function (val, context) {
        var min = context.binding[this.minName];
        var max = context.binding[this.maxName];
        var parsedNewValue = parseFloat(val);
        return (parsedNewValue >= max || parsedNewValue < min);
    };
    FormattedNumberBindingBehavior.prototype.onBlur = function (blurEvent, context) {
        this.formatValue(context);
    };
    FormattedNumberBindingBehavior.prototype.onPaste = function (pasteEvent, context) {
        var _this = this;
        setTimeout(function () {
            _this.cropValue(context);
            _this.formatValue(context);
        }, 0);
    };
    FormattedNumberBindingBehavior.prototype.bind = function (binding, scope, format, min, max) {
        var _this = this;
        if (format === void 0) { format = null; }
        if (min === void 0) { min = null; }
        if (max === void 0) { max = null; }
        _super.prototype.bind.call(this, binding, scope);
        var context = new binding_context_1.BindingContext();
        context.binding = binding;
        context.scope = scope;
        binding[this.formatName] = format || "0.00";
        binding[this.maxName] = max == null ? 1000000 : max;
        binding[this.minName] = min == null ? -1000000 : min;
        setTimeout(function () { return _this.formatValue(context); }, 1);
    };
    FormattedNumberBindingBehavior.prototype.formatValue = function (context) {
        var format = context.binding[this.formatName];
        var value = this.formatter.toView(context.value(), format);
        context.binding.updateSource(value);
        context.binding.updateTarget(value);
    };
    FormattedNumberBindingBehavior.prototype.cropValue = function (context) {
        var rawValue = context.binding['target'].value;
        var min = context.binding[this.minName];
        var max = context.binding[this.maxName];
        var format = context.binding[this.formatName];
        var maxFormatted = this.formatter.toView(max, format);
        var minFormatted = this.formatter.toView(max, format);
        var maxLength = Math.max(maxFormatted.length, minFormatted.length);
        if (rawValue != null && rawValue.length > maxLength) {
            rawValue = rawValue.substr(0, maxLength);
        }
        while (rawValue.length > 0) {
            if (this.isOutOfRange(rawValue, context)) {
                rawValue = rawValue.substr(0, rawValue.length - 1);
                continue;
            }
            break;
        }
        context.binding.updateSource(rawValue);
        context.binding.updateTarget(rawValue);
    };
    return FormattedNumberBindingBehavior;
}(input_behavior_base_1.InputBehaviorBase));
exports.FormattedNumberBindingBehavior = FormattedNumberBindingBehavior;
//# sourceMappingURL=formatted-number-behavior.js.map