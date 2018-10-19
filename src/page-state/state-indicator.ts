import { bindable, customElement } from "aurelia-framework";
import { WaitingState } from "./waiting-state";
import { resolvedView } from "aurelia-view-manager";

@customElement("state-indicator")
@resolvedView("ariovistus/fasting-troubadour", "state-indicator")
export class StateIndicator {
    @bindable() public waitState: WaitingState;
}

