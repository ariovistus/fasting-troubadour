import { OK, NOT_FOUND, FORBIDDEN } from "http-status-codes";

export class ErrorLoader {
    public errors: string[];
    public errorsWithPropertyName: boolean;
    public unauthorizedMessage: string;
    public notFoundMessage: string;
    public errorMessage: string;
    public validationErrorsMessage: string;
    public hasValidationErrors: boolean;
    public hasErrorMessage: boolean;

    constructor(config?: ErrorLoaderConfiguration) {
        config = config || {};
        this.clear();
        this.errorsWithPropertyName = 'errorsWithPropertyName' in config ? config.errorsWithPropertyName : false;
        this.unauthorizedMessage = 'unauthorizedMessage' in config ? config.unauthorizedMessage : null;
        this.notFoundMessage = 'notFoundMessage' in config ? config.notFoundMessage : null;
        this.validationErrorsMessage = 'validationErrorsMessage' in config ? config.validationErrorsMessage : "There are validation errors:";
    }

    public clear() {
        this.errors = [];
        this.hasValidationErrors = false;
        this.hasErrorMessage = false;
    }

    public load(networkResponse) {
        this.clear();
        if (!('body' in networkResponse)) {
            return;
        }
        if (networkResponse.body != null && 'errorMessage' in networkResponse.body) {
            this.errorMessage = networkResponse.body.errorMessage;
            this.hasErrorMessage = true;
        } else if (networkResponse.body != null && 'Errors' in networkResponse.body) {
            this.errors = [];
            let hasValidationErrors = false;
            for (var err of networkResponse.body.Errors) {
                if (this.errorsWithPropertyName) {
                    this.errors.push(`${err.PropertyName}: ${err.ErrorMessage}`);
                } else {
                    this.errors.push(err.ErrorMessage);
                }
                hasValidationErrors = true;
            }

            this.hasValidationErrors = hasValidationErrors;

            if (this.hasValidationErrors) {
                this.errorMessage = this.validationErrorsMessage;
                if (this.validationErrorsMessage != null) {
                    this.hasErrorMessage = true;
                }
            }
        } else if (networkResponse.status == NOT_FOUND && this.notFoundMessage != null) {
            this.errorMessage = this.notFoundMessage;
            this.hasErrorMessage = true;
        } else if (networkResponse.status == FORBIDDEN && this.unauthorizedMessage != null) {
            this.errorMessage = this.unauthorizedMessage;
            this.hasErrorMessage = true;
        }
    }
}

export interface ErrorLoaderConfiguration {
    errorsWithPropertyName?: boolean;
    unauthorizedMessage?: string;
    notFoundMessage?: string;
    validationErrorsMessage?: string;
}
