import { InputBehaviorBase } from "./input-behavior-base";
import { Binding, Scope } from "aurelia-binding";
import { BindingContext } from "./binding-context";

export class CustomCharsInputBindingBehavior extends InputBehaviorBase {
    regexName: string;

    constructor() {
        super();
        this.regexName = this.makeName("c_regex");
    }

    onPaste(pasteEvent, context: BindingContext) {
        setTimeout(() => {
            this.valueFixup(context, (c) => this.isValidCharacter(context, c));
        }, 0);
    }

    onKeyDown(keyEvent: KeyboardEvent, context : BindingContext) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        // if it does not match per regex, stop the keypress
        if (!this.isValidCharacter(context, this.getCharacter(keyEvent))) {
            keyEvent.preventDefault();
        }
    }

    isValidCharacter(context: BindingContext, c) {
        let regex = context.binding[this.regexName];
        return (regex.test(c));
    }

    bind(binding: Binding, scope: Scope, regex: string|RegExp = null) {
        super.bind(binding, scope);

        if(regex == null) {
            throw new Error("customCharsInput requires a regular expression parameter");
        }
        if(typeof(regex) == 'string') {
            regex = new RegExp(regex);
        }

        binding[this.regexName] = regex;
    }
}
