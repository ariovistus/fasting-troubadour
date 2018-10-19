import {customElement, bindable} from "aurelia-framework";
import { ErrorLoader } from "./error-loader";
import { resolvedView } from "aurelia-view-manager";

@customElement("error-summary")
@resolvedView("ariovistus/fasting-troubadour", "error-summary")
export class ErrorSummary {
    @bindable() public errorLoader: ErrorLoader = null;

    constructor() {
    }
}

