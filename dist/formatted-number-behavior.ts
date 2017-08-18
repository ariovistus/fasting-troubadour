import { autoinject } from "aurelia-framework";
import { Binding, Scope } from "aurelia-binding";
import { EventAggregator } from "aurelia-event-aggregator";
import { NumberFormatValueConverter } from "./number-format";
import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";

@autoinject
export class FormattedNumberBindingBehavior extends InputBehaviorBase {
    private formatter: NumberFormatValueConverter;
    private formatName: string;
    private maxName: string;
    private minName: string;
    private prevCaretStartName: string;
    private prevCaretEndName: string;
    private prevPasteLength: string;
    private prevSelectionContentName: string;

    constructor(private eventAggregator: EventAggregator) {
        super();
        this.formatter = new NumberFormatValueConverter();
        this.formatName = this.makeName("format");
        this.maxName = this.makeName("max");
        this.minName = this.makeName("min");
        this.prevCaretStartName = this.makeName("prev_caret_start");
        this.prevCaretEndName = this.makeName("prev_caret_end");
        this.prevCaretEndName = this.makeName("paste_len");
        this.prevSelectionContentName = this.makeName("prev_selection");
    }

    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext) {
        let isBackspace = keyEvent.keyCode == 8;
        let isDelete = keyEvent.keyCode == 46;
        let isCtrlX = keyEvent.ctrlKey && keyEvent.keyCode == 88;
        if (!(isBackspace || isDelete || isCtrlX) && this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        let inRange = function(start, end) {
            return keyEvent.keyCode >= start && keyEvent.keyCode <= end;
        };
        let value = context.value();
        let newValue = value;
        let dotIndex = value.indexOf(".");
        let selectionStart = context.binding['target'].selectionStart;
        let selectionEnd = context.binding['target'].selectionEnd;

        if(keyEvent.ctrlKey && !isCtrlX) {
            return;
        }else if (selectionStart !== undefined) {
            if(isBackspace) {
                if(selectionStart == selectionEnd) {
                    newValue = value.substr(0, selectionStart-1) + value.substring(selectionEnd, value.length);
                }else{
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd, value.length);
                }
            }else if(isDelete) {
                if(selectionStart == selectionEnd) {
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd+1, value.length);
                }else{
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd, value.length);
                }
            }else if(isCtrlX) {
                if(selectionStart == selectionEnd) {
                    newValue = value;
                }else{
                    newValue = value.substr(0, selectionStart) + value.substring(selectionEnd, value.length);
                }
            }else{
                newValue = value.substr(0, selectionStart) + keyEvent.key + value.substring(selectionEnd, value.length);
            }
        }

        let isDot = (keyCode) => keyCode == 190 || keyCode == 110;
        let isMinus = (keyCode) => keyCode == 189 || keyCode == 109;
        let isDigit = () => inRange(48, 57) || inRange(96, 105);

        // Allow . if not already present
        if ((isDot(keyEvent.keyCode) && dotIndex === -1)) {
            return;
        }
        // Allow - if not already present and position is right
        if ((isMinus(keyEvent.keyCode) && value.indexOf("-") === -1 && context.cursorAtStart())) {
            return;
        }

        if(!(isBackspace || isDelete || isCtrlX)) {
            // Ensure that it is a number and stop the keypress
            if (keyEvent.shiftKey || !isDigit()) {
                keyEvent.preventDefault();
            }
        }
        // Prevent too many decimal places
        let decimalPlaceCount = this.getDecimalPlaceCount(context);
        let regex = this.decimalPlaceOverflowRegex(decimalPlaceCount);
        if (dotIndex !== -1 && selectionStart !== undefined && selectionStart > dotIndex && regex.test(newValue)) {
            keyEvent.preventDefault();
        }

        // Prevent too large or small a value
        var parsedNewValue = parseFloat(newValue);
        if (this.isOutOfRange(newValue, context)) {
            keyEvent.preventDefault();
        }
    }

    private getDecimalPlaceCount(context: BindingContext) {
        let pattern = context.binding[this.formatName];
        let parts = pattern.split(".");
        if(parts.length > 1) {
            let decimalPlaceCount = parts[parts.length-1].length;
            return decimalPlaceCount;
        }
        return 0;
    }

    private decimalPlaceOverflowRegex(maxDecimalPlaces: number) {
        let regex = new RegExp("\\d*\\.\\d{" + (maxDecimalPlaces+1) + ",}");
        return regex;
    }

    private isOutOfRange(val: string, context: BindingContext) {
        let min = context.binding[this.minName];
        let max = context.binding[this.maxName];
        var parsedNewValue = parseFloat(val);
        return (parsedNewValue >= max || parsedNewValue < min);
    }

    onBlur(blurEvent, context: BindingContext) {
        this.formatValue(context);
    }

    onPaste(pasteEvent, context: BindingContext) {
        let selectionStart = context.binding['target'].selectionStart;
        let selectionEnd = context.binding['target'].selectionEnd;

        context.binding[this.prevCaretStartName] = selectionStart;
        context.binding[this.prevCaretEndName] = selectionEnd;
        let oldValue = context.binding['target'].value;
        context.binding[this.prevSelectionContentName] = oldValue.substring(selectionStart, selectionEnd);
        let pasteText = this.getPasteText(pasteEvent);
        context.binding[this.prevPasteLength] = pasteText.length;
        setTimeout(() => {
            this.cropValue(context);
            this.formatValue(context);
        }, 0);
    }

    private getPasteText(pasteEvent) {
        let clipboardData = 'clipboardData' in pasteEvent ? pasteEvent['clipboardData'] : window['clipboardData'];
        return clipboardData.getData("Text");
    }

    bind(binding: Binding, scope: Scope, format: string = null, min: number = null, max: number = null) {
        super.bind(binding, scope);
        let context = new BindingContext();
        context.binding = binding;
        context.scope = scope;
        
        binding[this.formatName] = format || "0.00";
        binding[this.maxName] = max == null ?  1000000 : max;
        binding[this.minName] = min == null ? -1000000 : min;
        setTimeout(() => this.formatValue(context), 1);

        this.eventAggregator.subscribe("formatted-number:refresh", () => {
            this.formatValue(context);
        });
    }

    private formatValue(context: BindingContext) {
        let format = context.binding[this.formatName];
        let value = this.formatter.toView(context.value(), format);
        if(context.binding.source != null) {
            //??
            context.binding.updateSource(value);
            context.binding.updateTarget(value);
        }
    }

    private cropValue(context: BindingContext) {
        let value = context.binding['target'].value;
        if(value == null) return;
        let newValue = value;
        let prevCaretStart = context.binding[this.prevCaretStartName];
        let prevCaretEnd = context.binding[this.prevCaretEndName];
        let pastedTextLength = context.binding[this.prevPasteLength];
        let oldSelection = context.binding[this.prevSelectionContentName];
        let pre = value.substr(0, prevCaretStart);
        let oldPasted = value.substr(prevCaretStart, pastedTextLength);
        let post = value.substr(prevCaretStart + pastedTextLength, value.length);
        let oldValue = pre + oldSelection + post; 

        let newPasted = oldPasted;
        newPasted = newPasted.replace(/[^0-9.]/g, "");
        if(pre.length == 0 && oldPasted.startsWith("-")) {
            newPasted = "-" + newPasted;
        }
        if((pre+post).indexOf(".") != -1) {
            newPasted = newPasted.replace(/\./g, "");
        }else {
            let dotIndex = newPasted.indexOf(".");
            newPasted = newPasted.substr(0, dotIndex+1) + newPasted.substr(dotIndex+1, newPasted.length).replace(/\./g, "");
        }

        let min = context.binding[this.minName];
        let max = context.binding[this.maxName];
        let format = context.binding[this.formatName];
        let maxFormatted = this.formatter.toView(max, format);
        let minFormatted = this.formatter.toView(max, format);

        let maxLength = Math.max(maxFormatted.length, minFormatted.length);

        let croppedValue = function(preLength, pasteLength, postLength) {
            return pre.substr(0, preLength) + newPasted.substr(0, pasteLength) + post.substr(0, postLength);
        };
        let wayTooLong = function(preLength, pasteLength, postLength) {
            let tempValue = "";
            if(oldSelection.length >= newPasted.length) {
                // length of text decreased after paste, but it's stil too long
                // (oldValue was invalid?)
                // so ignore old selection and crop pasted text
                tempValue = croppedValue(preLength, pasteLength, postLength);
            } else {
                // length of text increased after paste
                tempValue = croppedValue(preLength, pasteLength, postLength);
            }
            return tempValue.length > maxLength;
        };

        let decimalPlaceCount = this.getDecimalPlaceCount(context);
        let regex = this.decimalPlaceOverflowRegex(decimalPlaceCount);
        let tooManyDecimals = function(preLength, pasteLength, postLength) {
            return regex.test(croppedValue(preLength, pasteLength, postLength));
        }

        let preLength = pre.length;
        let pasteLength = newPasted.length;
        let postLength = post.length;
        while(
            preLength + pasteLength + postLength > 0 &&
            // before parsing number, crop to a known max length that shouldn't overflow
            (wayTooLong(preLength, pasteLength, postLength) ||
            this.isOutOfRange(croppedValue(preLength, pasteLength, postLength), context) || 
            // also make sure we haven't exceeded our allotment of decimal places
            tooManyDecimals(preLength, pasteLength, postLength))) {

            if(pasteLength > 0) {
                pasteLength--;
            }else if(postLength > 0) {
                postLength--;
            }else if(preLength > 0) {
                preLength--;
            }
        }

        value = croppedValue(preLength, pasteLength, postLength);

        context.binding.updateSource(value);
        context.binding.updateTarget(value);
    }
}
