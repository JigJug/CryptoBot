"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMA = void 0;
var EMA = /** @class */ (function () {
    function EMA(period) {
        this.period = period;
    }
    //methods
    EMA.prototype.emaCalc = function (priceToday, emaYesterday) {
        var N = this.period;
        var t = priceToday;
        var y = emaYesterday;
        var k = (2 / (N + 1));
        var emaToday = (t * k) + (y * (1 - k));
        return emaToday;
    };
    return EMA;
}());
exports.EMA = EMA;
