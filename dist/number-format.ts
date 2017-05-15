import * as numeral from "numeral";

export class NumberFormatValueConverter {
    toView(value: any, format: string) {
        if (format == null) {
            format = "0.00";
        }
        if(value == null || (typeof value == 'string' && value.trim() == "")) {
            return "";
        }
        return numeral(value).format(format);
    }

    fromView(value: any, format: string) {
        if(format == null) {
            format = "0.00";
        }
        if(value == null || (typeof value == 'string' && value.trim() == "")) {
            return null;
        }
        return numeral().unformat(value);
    }
}
