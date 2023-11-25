import {
  BaseStrategy,
  indicators,
  MarketDataObject,
  SingleMarketObject,
} from "../../../typings";
import { EMA } from "../Indicators/EMA";

export class SimpleEmaStrategy implements BaseStrategy {
  stopLoss;
  eventEmitter;
  ema;
  id;
  pubkey;

  constructor(
    stopLoss: number,
    eventEmitter: NodeJS.EventEmitter,
    id: string,
    pubkey: string
  ) {
    this.stopLoss = stopLoss;
    this.eventEmitter = eventEmitter;
    this.ema = new EMA(70);
    this.id = id;
    this.pubkey = pubkey;
  }

  buySellLogic(
    price: number,
    indicators: indicators,
    sold: boolean,
    bought: boolean,
    buySellTrigger: boolean
  ) {
    //make stoploss a % below the ema. defined in config
    let ema = indicators.ema;
    let stopLossDelta = ema * this.stopLoss;
    let stopPrice = ema - stopLossDelta;

    if (buySellTrigger && sold) {
      if (price > ema) {
        console.log("buyemitter trigger", price, ema);
        this.eventEmitter.emit("Buy", true, this.id, this.pubkey);
      }
    } else if (buySellTrigger && bought) {
      if (price < ema) {
        console.log("sellemitter trigger", price, ema);
        this.eventEmitter.emit("Sell", true, this.id, this.pubkey);
      }
    }
  }

  updateIndicators(md: MarketDataObject, indicators: indicators) {
    indicators.ema = this.calcEma(md.close, indicators.ema);
    return indicators;
  }

  private calcEma(close: number, emaYesterday: number) {
    console.log("calcing ema");
    const ema = this.ema;
    return ema.emaCalc(close, emaYesterday);
  }
}
