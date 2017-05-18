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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var number_format_1 = require("./number-format");
var input_behavior_base_1 = require("./input-behavior-base");
var binding_context_1 = require("./binding-context");
var FormattedNumberBindingBehavior = (function (_super) {
    __extends(FormattedNumberBindingBehavior, _super);
    function FormattedNumberBindingBehavior(eventAggregator) {
        var _this = _super.call(this) || this;
        _this.eventAggregator = eventAggregator;
        _this.formatter = new number_format_1.NumberFormatValueConverter();
        _this.formatName = _this.makeName("format");
        _this.maxName = _this.makeName("max");
        _this.minName = _this.makeName("min");
        _this.prevCaretStartName = _this.makeName("prev_caret_start");
        _this.prevCaretEndName = _this.makeName("prev_caret_end");
        _this.prevCaretEndName = _this.makeName("paste_len");
        _this.prevSelectionContentName = _this.makeName("prev_selection");
        return _this;
    }
    FormattedNumberBindingBehavior.prototype.onKeyDown = function (keyEvent, context) {
        var isBackspace = keyEvent.keyCode == 8;
        var isDelete = keyEvent.keyCode == 46;
        var isCtrlX = keyEvent.ctrlKey && keyEvent.keyCode == 88;
        if (!(isBackspace || isDelete || isCtrlX) && this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        var inRange = function (start, end) {
            return keyEvent.keyCode >= start.charCodeAt(0) && keyEvent.keyCode <= end.charCodeAt(0);
        };
        var value = context.value();
        var newValue = value;
        var dotIndex = value.indexOf(".");
        var selectionStart = context.binding['target'].selectionStart;
        var selectionEnd = context.binding['target'].selectionEnd;
        if (keyEvent.ctrlKey && !isCtrlX) {
            return;
        }
        else if (selectionStart !== undefined) {
            if (isBackspace) {
                if (selectionStart == selectionEnd) {
                    newValue = value.substr(0, selectionStart - 1) + value.substring(selectionEnd, value.length);
                }
                else {
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd, value.length);
                }
            }
            else if (isDelete) {
                if (selectionStart == selectionEnd) {
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd + 1, value.length);
                }
                else {
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd, value.length);
                }
            }
            else if (isCtrlX) {
                if (selectionStart == selectionEnd) {
                    newValue = value;
                }
                else {
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd, value.length);
                }
            }
            else {
                newValue = value.substr(0, selectionStart) + keyEvent.key + value.substring(selectionEnd, value.length);
            }
        }
        if ((keyEvent.keyCode == 190 && dotIndex === -1)) {
            return;
        }
        if ((keyEvent.keyCode == 189 && value.indexOf("-") === -1 && context.cursorAtStart())) {
            return;
        }
        if (!(isBackspace || isDelete || isCtrlX)) {
            if ((keyEvent.shiftKey || !inRange("0", "9"))) {
                keyEvent.preventDefault();
            }
        }
        var decimalPlaceCount = this.getDecimalPlaceCount(context);
        var regex = this.decimalPlaceOverflowRegex(decimalPlaceCount);
        if (dotIndex !== -1 && selectionStart !== undefined && selectionStart > dotIndex && regex.test(newValue)) {
            keyEvent.preventDefault();
        }
        var parsedNewValue = parseFloat(newValue);
        if (this.isOutOfRange(newValue, context)) {
            keyEvent.preventDefault();
        }
    };
    FormattedNumberBindingBehavior.prototype.getDecimalPlaceCount = function (context) {
        var pattern = context.binding[this.formatName];
        var parts = pattern.split(".");
        if (parts.length > 1) {
            var decimalPlaceCount = parts[parts.length - 1].length;
            return decimalPlaceCount;
        }
        return 0;
    };
    FormattedNumberBindingBehavior.prototype.decimalPlaceOverflowRegex = function (maxDecimalPlaces) {
        var regex = new RegExp("\\d*\\.\\d{" + (maxDecimalPlaces + 1) + ",}");
        return regex;
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
        var selectionStart = context.binding['target'].selectionStart;
        var selectionEnd = context.binding['target'].selectionEnd;
        context.binding[this.prevCaretStartName] = selectionStart;
        context.binding[this.prevCaretEndName] = selectionEnd;
        var oldValue = context.binding['target'].value;
        context.binding[this.prevSelectionContentName] = oldValue.substring(selectionStart, selectionEnd);
        var pasteText = this.getPasteText(pasteEvent);
        context.binding[this.prevPasteLength] = pasteText.length;
        setTimeout(function () {
            _this.cropValue(context);
            _this.formatValue(context);
        }, 0);
    };
    FormattedNumberBindingBehavior.prototype.getPasteText = function (pasteEvent) {
        var clipboardData = 'clipboardData' in pasteEvent ? pasteEvent['clipBoardData'] : window['clipboardData'];
        return clipboardData.getData("Text");
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
        this.eventAggregator.subscribe("formatted-number:refresh", function () {
            _this.formatValue(context);
        });
    };
    FormattedNumberBindingBehavior.prototype.formatValue = function (context) {
        var format = context.binding[this.formatName];
        var value = this.formatter.toView(context.value(), format);
        context.binding.updateSource(value);
        context.binding.updateTarget(value);
    };
    FormattedNumberBindingBehavior.prototype.cropValue = function (context) {
        var value = context.binding['target'].value;
        if (value == null)
            return;
        var newValue = value;
        var prevCaretStart = context.binding[this.prevCaretStartName];
        var prevCaretEnd = context.binding[this.prevCaretEndName];
        var pastedTextLength = context.binding[this.prevPasteLength];
        var oldSelection = context.binding[this.prevSelectionContentName];
        var pre = value.substr(0, prevCaretStart);
        var oldPasted = value.substr(prevCaretStart, pastedTextLength);
        var post = value.substr(prevCaretStart + pastedTextLength, value.length);
        var oldValue = pre + oldSelection + post;
        var newPasted = oldPasted;
        newPasted = newPasted.replace(/[^0-9.]/g, "");
        if (pre.length == 0 && oldPasted.startsWith("-")) {
            newPasted = "-" + newPasted;
        }
        if ((pre + post).indexOf(".") != -1) {
            newPasted = newPasted.replace(/\./g, "");
        }
        else {
            var dotIndex = newPasted.indexOf(".");
            newPasted = newPasted.substr(0, dotIndex + 1) + newPasted.substr(dotIndex + 1, newPasted.length).replace(/\./g, "");
        }
        console.info("prepaste value: ", oldValue);
        console.info("postpaste value: ", newValue);
        var min = context.binding[this.minName];
        var max = context.binding[this.maxName];
        var format = context.binding[this.formatName];
        var maxFormatted = this.formatter.toView(max, format);
        var minFormatted = this.formatter.toView(max, format);
        var maxLength = Math.max(maxFormatted.length, minFormatted.length);
        var croppedValue = function (preLength, pasteLength, postLength) {
            return pre.substr(0, preLength) + newPasted.substr(0, pasteLength) + post.substr(0, postLength);
        };
        var wayTooLong = function (preLength, pasteLength, postLength) {
            var tempValue = "";
            if (oldSelection.length >= newPasted.length) {
                tempValue = croppedValue(preLength, pasteLength, postLength);
            }
            else {
                tempValue = croppedValue(preLength, pasteLength, postLength);
            }
            return tempValue.length > maxLength;
        };
        var decimalPlaceCount = this.getDecimalPlaceCount(context);
        var regex = this.decimalPlaceOverflowRegex(decimalPlaceCount);
        var tooManyDecimals = function (preLength, pasteLength, postLength) {
            return regex.test(croppedValue(preLength, pasteLength, postLength));
        };
        var preLength = pre.length;
        var pasteLength = newPasted.length;
        var postLength = post.length;
        while (preLength + pasteLength + postLength > 0 &&
            (wayTooLong(preLength, pasteLength, postLength) ||
                this.isOutOfRange(croppedValue(preLength, pasteLength, postLength), context) ||
                tooManyDecimals(preLength, pasteLength, postLength))) {
            if (pasteLength > 0) {
                pasteLength--;
            }
            else if (postLength > 0) {
                postLength--;
            }
            else if (preLength > 0) {
                preLength--;
            }
        }
        value = croppedValue(preLength, pasteLength, postLength);
        context.binding.updateSource(value);
        context.binding.updateTarget(value);
    };
    return FormattedNumberBindingBehavior;
}(input_behavior_base_1.InputBehaviorBase));
FormattedNumberBindingBehavior = __decorate([
    aurelia_framework_1.autoinject,
    __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
], FormattedNumberBindingBehavior);
exports.FormattedNumberBindingBehavior = FormattedNumberBindingBehavior;
//# sourceMappingURL=formatted-number-behavior.js.map