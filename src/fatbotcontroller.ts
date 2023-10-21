import { EventEmitter } from "events";
import { CryptoTradingBot } from "./Main";
import startBot from "./StartBot";
import { BotConfig } from "./typings";

interface Bots {
  [key: string]: {
    [key:string]: CryptoTradingBot
  }
}

export class FatBotController {
  bots: Bots
  currentId: string
  constructor(){
    this.bots = {};
    this.currentId = "000000";
  }

  private generateId() {
    console.log(this.currentId)
    let id = parseInt(this.currentId, 16);
    this.currentId = '878g8g8ggg'//(id + 1).toString();
    console.log(this.currentId)
    return '878g8g8ggg'//(id + 1).toString()
  }

  async loadbot(botConfig: BotConfig, pubkey: string, events: EventEmitter) {
    console.log(botConfig, pubkey)
    const pk = pubkey.toString()
    const newId = this.generateId();
    const nb = await startBot(botConfig, events, this.currentId, pubkey);
    const newb = {}
    newb[newId] = nb
    //nb?.startBot();
    this.bots[pk] = newb;
    console.log(this.bots)
    return newId;
  }



}



