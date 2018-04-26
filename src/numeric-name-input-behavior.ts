import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";

export class NumericNameInputBindingBehavior extends InputBehaviorBase {

    onPaste(pasteEvent, context: BindingContext) {
        setTimeout(() => {
            this.valueFixup(context, this.isValidCharacter);
        }, 0);
    }

    onKeyDown(keyEvent, context: BindingContext) {
        if (this.keyDownStandardAllowed(keyEvent)) {
            return;
        }

        // if it is not alpha, -, ', space, or numeric, stop the keypress
        if (!this.isValidCharacter(keyEvent)) {
            keyEvent.preventDefault();
        }
    }

    isValidCharacter(keyEvent) {
        let c = this.getCharacter(keyEvent);
        return (/[a-zA-Z\-' 0-9]/.test(c));
    }
}
