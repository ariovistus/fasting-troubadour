import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import {BindingContext } from "fasting-troubadour/binding-context";

@autoinject
export class App {
    message = 'Hello World!';
    cows = 98;
    regex = /[#$ ]/;

    constructor(private eventAggregator: EventAggregator) {
    }

    setCows() {
        this.cows = 999;
    }

    refreshCows() {
        this.eventAggregator.publish("formatted-number:refresh");
    }
}
