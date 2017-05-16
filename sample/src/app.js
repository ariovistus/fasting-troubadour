import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(EventAggregator)
    export class App {

        constructor(eventAggregator) {
            this.eventAggregator = eventAggregator;

            this.message = 'Hello World!';
            this.cows = 98;
        }

        setCows() {
            this.cows = 999;
        }

        refreshCows() {
            this.eventAggregator.publish("formatted-number:refresh");
        }
    }
