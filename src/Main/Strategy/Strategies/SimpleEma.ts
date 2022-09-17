import { indicators, MarketDataObject } from "../../typings"
import { EMA } from "../Indicators/EMA"

export class SimpleEmaStrategy{

    stopLoss
    buyEmmiter
    sellEmmiter
    ema


    constructor(stopLoss: number, buyEmmiter: Function, sellEmitter: Function){
        this.stopLoss = stopLoss
        this.buyEmmiter = buyEmmiter
        this.sellEmmiter = sellEmitter
        this.ema = new EMA(70);
    }


    buySellLogic(price: number, indicators: indicators, sold: boolean, bought: boolean, buySellTrigger: boolean){
        //make stoploss a % below the ema. defined in config
        let ema = indicators.ema
        let stopLossDelta = ema * this.stopLoss;
        let stopPrice = ema - stopLossDelta;

        if(buySellTrigger && sold){
            if(price > ema){
                this.buyEmmiter();
            }
        }

        else if(buySellTrigger && bought){
            if(price < stopPrice){
                this.sellEmmiter();
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