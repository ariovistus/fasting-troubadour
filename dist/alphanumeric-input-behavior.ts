import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";

export class AlphanumericInputBindingBehavior extends InputBehaviorBase {

    onPaste(pasteEvent, context: BindingContext) {
        setTimeout(() => {
            this.valueFixup(context, this.isValidCharacter);
        }, 0);
    }

    onKeyDown(keyEvent: KeyboardEvent, context : BindingContext) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }
        // if it is not alpha, or numeric, stop the keypress
        if (!this.isValidCharacter(keyEvent.key)) {
            keyEvent.preventDefault();
        }
    }

    isValidCharacter(c) {
        return (/[a-zA-Z0-9]/.test(c));
    }
}
