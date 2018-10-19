import {bindable, customElement} from "aurelia-framework";

@customElement("success-icon")
@resolvedView("ariovistus/fasting-troubadour", "success-icon")
export class SuccessIcon {
    @bindable() public shown: boolean;

    shownChanged(newValue, oldValue) {
        if (newValue == true) {
            setTimeout(() => {
                this.shown = false;
            }, 3000);
        }
    }
}


