import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";

export class NumericInputBindingBehavior extends InputBehaviorBase {

    onPaste(pasteEvent, context: BindingContext) {
        setTimeout(() => {
            this.valueFixup(context, this.isValidCharacter);
        }, 0);
    }

    onKeyDown(keyEvent, context: BindingContext) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }

        // if it is not numeric, stop the keypress
        if (!this.isValidCharacter(this.getCharacter(keyEvent))) {
            keyEvent.preventDefault();
        }
    }

    isValidCharacter(c) {
        return (/[0-9]/.test(c));
    }
}
