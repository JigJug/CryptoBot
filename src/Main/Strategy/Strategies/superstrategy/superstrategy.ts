import { process, runModel } from ".";
import { BaseStrategy, MarketDataObject, indicators } from "../../../../typings";
import { appendCsv } from "../../../Utils/StoreDataToJson";
import { EMA } from "../../Indicators/EMA";

interface Decessions {
  Prediction: number
  Actual: number
  Decision: string
}

export class SuperStrategy implements BaseStrategy {
  stopLoss;
  eventEmitter;
  ema;
  id;
  pubkey;

  private lastDecession
  private currentDecession
  private buyPrice

  constructor(
    stopLoss: number,
    eventEmitter: NodeJS.EventEmitter,
    id: string,
    pubkey: string
  ) {
    this.stopLoss = stopLoss;
    this.eventEmitter = eventEmitter;
    this.ema = new EMA(70)
    this.id = id;
    this.pubkey = pubkey;
    this.lastDecession = "Sell";
    this.currentDecession = "Sell";
    this.buyPrice = 0;
  }

  buySellLogic(price: number, indicators: indicators, sold: boolean, bought: boolean, buySellTrigger: boolean){

    if(this.currentDecession == this.lastDecession || this.currentDecession == "wait")  return
    if(!buySellTrigger) return

    if (this.currentDecession == "Buy") {
      this.lastDecession = this.currentDecession;
      this.buyPrice = price;
      this.eventEmitter.emit("Buy", true, this.id, this.pubkey);
    }

    if (this.currentDecession == "Sell") {
      this.lastDecession = this.currentDecession;
      this.eventEmitter.emit("Sell", true, this.id, this.pubkey);
    } else if(price < this.buyPrice - (this.buyPrice*this.stopLoss)){
      this.lastDecession = "Sell";
      this.currentDecession = "Sell";
      this.eventEmitter.emit("Sell", true, this.id, this.pubkey);
    }
    
  }

  updateIndicators(md: MarketDataObject, indicators: indicators){
    appendCsv(".1dcandles.csv", `${md.startTime} ${md.time} ${md.open} ${md.high} ${md.low} ${md.close} ${md.volume}`);
    this.run();
    return indicators
  }

  private async run() {
    try {
      const data = await runModel("./runprediction.py");
      const decessions: Decessions[] = process(data);
      this.currentDecession = decessions[decessions.length -1].Decision
    } catch (err) {
      console.error(err);
    }    
  }

}