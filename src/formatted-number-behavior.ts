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

    constructor(private eventAggregator: EventAggregator) {
        super();
        this.formatter = new NumberFormatValueConverter();
        this.formatName = this.makeName("format");
        this.maxName = this.makeName("max");
        this.minName = this.makeName("min");
    }

    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        let value = context.value();
        let dotIndex = value.indexOf(".");
        let selectionStart = context.binding['target'].selectionStart;

        // Allow . if not already present
        if ((keyEvent.keyCode == 190 && dotIndex === -1)) {
            return;
        }
        // Allow - if not already present and position is right
        if ((keyEvent.keyCode == 189 && value.indexOf("-") === -1 && context.cursorAtStart())) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((keyEvent.shiftKey || (keyEvent.keyCode < 48 || keyEvent.keyCode > 57)) && (keyEvent.keyCode < 96 || keyEvent.keyCode > 105)) {
            keyEvent.preventDefault();
        }
        // Prevent too many decimal places
        let pattern = context.binding[this.formatName];
        let parts = pattern.split(".");
        if(parts.length > 1) {
            let decimalPlaceCount = parts[parts.length-1].length;
            let regex = new RegExp("\\d*\\.\\d{" + decimalPlaceCount + "}");
            if (dotIndex !== -1 && selectionStart !== undefined && selectionStart > dotIndex && regex.test(value)) {
                keyEvent.preventDefault();
            }
        }
        // Prevent too large or small a value
        if (selectionStart !== undefined) {
            var newValue = value.substr(0, selectionStart) + keyEvent.key + value.substring(selectionStart, value.length);
            var parsedNewValue = parseFloat(newValue);
            if (this.isOutOfRange(newValue, context)) {
                keyEvent.preventDefault();
            }
        }
    }

    private isOutOfRange(val: string, context) {
        let min = context.binding[this.minName];
        let max = context.binding[this.maxName];
        var parsedNewValue = parseFloat(val);
        return (parsedNewValue >= max || parsedNewValue < min);
    }

    onBlur(blurEvent, context: BindingContext) {
        this.formatValue(context);
    }

    onPaste(pasteEvent, context: BindingContext) {
        setTimeout(() => {
            this.cropValue(context);
            this.formatValue(context);
        }, 0);
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
        context.binding.updateSource(value);
        context.binding.updateTarget(value);
    }

    private cropValue(context: BindingContext) {
        let rawValue = context.binding['target'].value;
        let min = context.binding[this.minName];
        let max = context.binding[this.maxName];
        let format = context.binding[this.formatName];

        let maxFormatted = this.formatter.toView(max, format);
        let minFormatted = this.formatter.toView(max, format);

        let maxLength = Math.max(maxFormatted.length, minFormatted.length);

        if(rawValue != null && rawValue.length > maxLength) {
            rawValue = rawValue.substr(0, maxLength);
        }
        while(rawValue.length > 0) {
            if(this.isOutOfRange(rawValue, context)) {
                rawValue = rawValue.substr(0, rawValue.length-1);
                continue;
            }
            break;
        }

        context.binding.updateSource(rawValue);
        context.binding.updateTarget(rawValue);
    }
}
