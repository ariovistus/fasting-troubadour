import { InputBehaviorBase } from "./input-behavior-base";
import { BindingContext } from "./binding-context";

export class TrimBindingBehavior extends InputBehaviorBase {

    onPaste(pasteEvent, context: BindingContext) {
        setTimeout(() => this.trimValue(context), 0);
    }

    onBlur(blurEvent, context: BindingContext) {
        this.trimValue(context);
    }

    trimValue(context) {
        let value = context.value();
        if(value != null && typeof value === 'string' && value.trim() !== value) {
            let trimmed = value.trim()
            context.binding.updateSource(trimmed);
            context.binding.updateTarget(trimmed);
        }
    }
}
