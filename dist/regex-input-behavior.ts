import { autoinject } from "aurelia-framework";
import { Binding, Scope } from "aurelia-binding";
import { EventAggregator } from "aurelia-event-aggregator";
import { NumberFormatValueConverter } from "./number-format";
import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";

@autoinject
export class RegexInputBindingBehavior extends InputBehaviorBase {
    private regexName: string;
    private prevCaretStartName: string;
    private prevCaretEndName: string;
    private prevPasteLength: string;
    private prevSelectionContentName: string;

    constructor() {
        super();
        this.regexName = this.makeName("regex");
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
        if(keyEvent.keyCode == 16 /*shift*/ ) {
            return;
        }
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

        let regex = context.binding[this.regexName];

        if(!regex.test(newValue)) {
            keyEvent.preventDefault();
        }
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
        }, 0);
    }

    private getPasteText(pasteEvent) {
        let clipboardData = 'clipboardData' in pasteEvent ? pasteEvent['clipboardData'] : window['clipboardData'];
        return clipboardData.getData("Text");
    }

    bind(binding: Binding, scope: Scope, regex: string|RegExp = null) {
        super.bind(binding, scope);
        let context = new BindingContext();
        context.binding = binding;
        context.scope = scope;

        if(regex == null) {
            // default param is only for inheritance to not complain
            throw new Error("regexInput requires a regexp");
        }

        if(typeof(regex) == 'string') {
            regex = new RegExp(regex);
        }

        binding[this.regexName] = regex;
    }

    private cropValue(context: BindingContext) {
    }
}
