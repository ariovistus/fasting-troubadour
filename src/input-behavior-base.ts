import { Binding, Scope } from "aurelia-binding";
import { BindingContext } from "./binding-context";

export class InputBehaviorBase {
    keyDownName: string;
    blurName: string;
    pasteName: string;

    constructor() {
        this.keyDownName = this.makeName("keydown");
        this.blurName = this.makeName("blur");
        this.pasteName = this.makeName("paste");
    }

    protected makeName(nom: string): string {
        return `_${this.constructor['name']}_${nom}`;
    }

    getCharacter(keyEvent: KeyboardEvent) {
        let ms_ie = false;
        var ua = window.navigator.userAgent;
        var old_ie = ua.indexOf('MSIE ');
        var new_ie = ua.indexOf('Trident/');

        if ((old_ie > -1) || (new_ie > -1)) {
            ms_ie = true;
        }

        if ( ms_ie ) {
            return keyEvent.char;
        }else{
            return keyEvent.key;
        }
    }

    onKeyDown(keyEvent: KeyboardEvent, context: BindingContext) {
    }

    onBlur(blurEvent: Event, context: BindingContext) {
    }

    onPaste(pasteEvent: Event, context: BindingContext) {
    }

    keyDownStandardAllowed(keyEvent: KeyboardEvent) {
        // Allow: delete, backspace, tab, escape, enter
        if ([46, 8, 9, 27, 13].findIndex(x => x === keyEvent.keyCode) !== -1) {
            return true;
        }
        // Allow: Ctrl+A
        if ((keyEvent.keyCode == 65 && keyEvent.ctrlKey === true) ||
            // Allow: Ctrl+C
            (keyEvent.keyCode == 67 && keyEvent.ctrlKey === true) ||
            // Allow: Ctrl+X
            (keyEvent.keyCode == 88 && keyEvent.ctrlKey === true) ||
            // Allow: Ctrl+V
            (keyEvent.keyCode == 86 && keyEvent.ctrlKey === true) ||
            // Allow: home, end, left, right
            (keyEvent.keyCode >= 35 && keyEvent.keyCode <= 39)) {
            return true;
        }
        return false;
    }

    valueFixup(context: BindingContext, isValid: Function) {
        let value = context.value() || "";
        let state = {};
        let newValue = "";
        for (var i = 0; i < value.length; i++) {
            if(isValid(value[i], i, value, state)) {
                newValue += value[i];
            }
        }
        context.binding.updateSource(newValue);
        context.binding.updateTarget(newValue);
    }

    bind(binding: Binding, scope: Scope) {
        let context = new BindingContext();
        context.binding = binding;
        context.scope = scope;
        
        binding[this.keyDownName] = (keyEvent) => {
            this.onKeyDown(keyEvent, context);
        };
        binding['target'].addEventListener('keydown', binding[this.keyDownName]);

        binding[this.pasteName] = (pasteEvent) => {
            this.onPaste(pasteEvent, context);
        };
        binding['target'].addEventListener('paste', binding[this.pasteName]);

        binding[this.blurName] = (blurEvent) => {
            this.onBlur(blurEvent, context);
        }
        binding['target'].addEventListener('blur', binding[this.blurName]);

    }

    unbind(binding: Binding, scope: Scope) {
        if (this.keyDownName in binding) {
            binding['target'].removeEventListener('keydown', binding[this.keyDownName]);
        }
        if(this.blurName in binding) {
            binding['target'].removeEventListener('blur', binding[this.blurName]);
        }
        if (this.pasteName in binding) {
            binding['target'].removeEventListener('paste', binding[this.pasteName]);
        }
    }
}

