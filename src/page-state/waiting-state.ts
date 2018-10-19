export class WaitingState {
    waiting: boolean;
    success: boolean;
    failed: boolean;

    constructor() {
        this.waiting = false;
        this.success = false;
        this.failed = false;
    }
}
