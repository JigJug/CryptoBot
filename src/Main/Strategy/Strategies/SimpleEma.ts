import { indicators, MarketDataObject, SingleMarketObject } from "../../../typings"
import { EMA } from "../Indicators/EMA"

export class SimpleEmaStrategy{

    stopLoss
    eventEmitter
    ema

    constructor(stopLoss: number, eventEmitter: NodeJS.EventEmitter){
        this.stopLoss = stopLoss
        this.eventEmitter = eventEmitter
        this.ema = new EMA(70);
    }


    buySellLogic(price: number, indicators: indicators, sold: boolean, bought: boolean, buySellTrigger: boolean){
        //make stoploss a % below the ema. defined in config
        let ema = indicators.ema;
        let stopLossDelta = ema * this.stopLoss;
        let stopPrice = ema - stopLossDelta;

        if(buySellTrigger && sold){
            if(price > ema){
                console.log('buyemitter trigger', price, ema);
                this.eventEmitter.emit('Buy', true);
            }
        }

        else if(buySellTrigger && bought){
            if(price < stopPrice){
                console.log('sellemitter trigger', price, ema);
                this.eventEmitter.emit('Sell', true);
            }
        }
    }

    updateIndicators(md: MarketDataObject, indicators: indicators){
        indicators.ema = this.calcEma(md.close, indicators.ema);
        return indicators
    }

    calcEma(close: number, emaYesterday: number){
        console.log('calcing ema')
        const ema = this.ema;
        return ema.emaCalc(close, emaYesterday);
    }
}