"use strict";
/*
Calculates the ema for a given closing price at the end of the time interval
To find the first ema entry When calculating a data set, the SMA will need to be run first
The SMA value will give the first value of EMA yesterday.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMA = void 0;
var EMA = /** @class */ (function () {
    function EMA(period, data) {
        this.period = period;
        this.data = data;
        this.sma = this.smaCalc();
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
    //only use this if you need to calc full ema. runs once to get the sma
    //need sma to use as the first value of ema yesterday, then from there
    //can calc the ema
    EMA.prototype.smaCalc = function () {
        var totalPrice = 0;
        //this.data.map((value: any) => {
        //    totalPrice += value.close
        //})
        for (var i = 0; i < this.period; i++) {
            totalPrice = totalPrice + this.data[i].close;
        }
        return totalPrice / this.period;
    };
    return EMA;
}());
exports.EMA = EMA;
