import * as fs from "fs";
import { BotConfig } from "./typings";
import { FatBotController } from "./fatbotcontroller";
import { EventEmitter } from "events";
import { MarketDataObject } from "./typings";
import * as dotenv from "dotenv";
dotenv.config();

export class Trader {
  events: EventEmitter
  botController: FatBotController
  constructor(){
    this.events = new EventEmitter();
    this.botController = new FatBotController()
  }

  listeners() {
    this.getPrice();
    this.getTimeFrameData();
    this.buySellListeners();
  }

  bot(id: string, pubkey: string) {
    return this.botController.bots[pubkey][id];
  }

  getBotConfigs(): BotConfig {
    let configPAth = process.env.CONFIG_PATH
    let botConfigRaw = fs.readFileSync(configPAth!, "utf8");
    return JSON.parse(botConfigRaw);
  }

  async startBot() {
    try {
      const config = this.getBotConfigs();
      const id = this.botController.generateId();
      await this.botController.loadbot(config, "4t34t34t", this.events);
      this.bot(id, "4t34t34t").startBot();
    } catch (err) {
      throw err
    }
  }

  getPrice() {
    this.events.on("SingleMarketData", (price: number, id: string, pubkey: string) => {
      const cb = this.bot(id, pubkey);
      cb.price = price;
      cb.strategy.buySellLogic(
        price,
        cb.indicators,
        cb.sold,
        cb.bought,
        cb.buySellTrigger
      );
    });
  }

  getTimeFrameData() {
    this.events.on(
      "TimeFrameData",
      (md: MarketDataObject, id: string, pubkey: string) => {
        const cb = this.bot(id, pubkey);
        console.log(md);
        cb.updateIndicators(md);
        cb.updateMarketData(md);
        console.log("updated market data: \n" + cb.marketData?.time + "\n");
        console.log("ema:: ", cb.indicators.ema);
      }
    );
  }

  buySellListeners() {
    this.events.on("Buy", (buy: boolean, id, pubkey: string) => {
      const cb = this.bot(id, pubkey);
      console.log("recieved buy signal");
      if (buy && cb.buySellTrigger && cb.sold) {
        cb.getBuy();
      }
    });
  
    this.events.on("Sell", (sell: boolean, id, pubkey: string) => {
      const cb = this.bot(id, pubkey);
      console.log("recieved sell signal");
      if (sell && cb.buySellTrigger && cb.bought) {
        cb.getSell();
      }
    });
  }
  
}
