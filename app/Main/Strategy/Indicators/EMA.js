"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMA = void 0;
class EMA {
    constructor(period) {
        this.period = period;
    }
    //methods
    emaCalc(priceToday, emaYesterday) {
        let N = this.period;
        let t = priceToday;
        let y = emaYesterday;
        let k = (2 / (N + 1));
        let emaToday = (t * k) + (y * (1 - k));
        return emaToday;
    }
}
exports.EMA = EMA;
