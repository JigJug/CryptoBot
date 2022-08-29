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
    //only use this if you need to calc full ema. runs once to get the sma
    //need sma to use as the first value of ema yesterday, then from there
    //can calc the ema
    smaCalc(data) {
        let totalPrice = 0;
        for (let i = 0; i < this.period; i++) {
            totalPrice = totalPrice + data[i].close;
        }
        return totalPrice / this.period;
    }
}
exports.EMA = EMA;
