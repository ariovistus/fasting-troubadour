"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numeral = require("numeral");
var NumberFormatValueConverter = (function () {
    function NumberFormatValueConverter() {
    }
    NumberFormatValueConverter.prototype.toView = function (value, format) {
        if (format == null) {
            format = "0.00";
        }
        if (value == null || (typeof value == 'string' && value.trim() == "")) {
            return "";
        }
        return numeral(value).format(format);
    };
    NumberFormatValueConverter.prototype.fromView = function (value, format) {
        if (format == null) {
            format = "0.00";
        }
        if (value == null || (typeof value == 'string' && value.trim() == "")) {
            return null;
        }
        return numeral().unformat(value);
    };
    return NumberFormatValueConverter;
}());
exports.NumberFormatValueConverter = NumberFormatValueConverter;
//# sourceMappingURL=number-format.js.map