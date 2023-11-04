"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleEmaStrategy = void 0;
const EMA_1 = require("../Indicators/EMA");
class SimpleEmaStrategy {
    constructor(stopLoss, eventEmitter, id, pubkey) {
        this.stopLoss = stopLoss;
        this.eventEmitter = eventEmitter;
        this.ema = new EMA_1.EMA(70);
        this.id = id;
        this.pubkey = pubkey;
    }
    buySellLogic(price, indicators, sold, bought, buySellTrigger) {
        //make stoploss a % below the ema. defined in config
        let ema = indicators.ema;
        let stopLossDelta = ema * this.stopLoss;
        let stopPrice = ema - stopLossDelta;
        if (buySellTrigger && sold) {
            if (price > ema) {
                console.log('buyemitter trigger', price, ema);
                this.eventEmitter.emit('Buy', true, this.id, this.pubkey);
            }
        }
        else if (buySellTrigger && bought) {
            if (price < ema) {
                console.log('sellemitter trigger', price, ema);
                this.eventEmitter.emit('Sell', true, this.id, this.pubkey);
            }
        }
    }
    updateIndicators(md, indicators) {
        indicators.ema = this.calcEma(md.close, indicators.ema);
        return indicators;
    }
    calcEma(close, emaYesterday) {
        console.log('calcing ema');
        const ema = this.ema;
        return ema.emaCalc(close, emaYesterday);
    }
}
exports.SimpleEmaStrategy = SimpleEmaStrategy;
