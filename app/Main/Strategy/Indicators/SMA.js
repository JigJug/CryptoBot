"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMA = void 0;
class SMA {
    constructor(period) {
        this.period = period;
    }
    //methods
    smaCalc(data) {
        let totalPrice = 0;
        for (let i = 0; i < this.period; i++) {
            totalPrice = totalPrice + data[i].close;
        }
        return totalPrice / this.period;
    }
}
exports.SMA = SMA;
