import { EventEmitter } from "events";
import { CryptoTradingBot } from "./Main";
import loadBot from "./loadbot";
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
    this.currentId = "100000";
  }

  generateId() {
    let id = parseInt(this.currentId, 16);
    this.currentId = (id + 1).toString(16).toUpperCase();
    return this.currentId;
  }

  async loadbot(botConfig: BotConfig, pubkey: string, events: EventEmitter) {
    console.log(botConfig, pubkey)
    const pk = pubkey.toString()
    //const newId = this.generateId();
    const nb = await loadBot(botConfig, events, this.currentId, pubkey);
    const newb = {}
    newb[this.id] = nb
    //nb?.startBot();
    this.bots[pk] = newb;
    //console.log(this.bots)
    //return newId;
  }

  async retrieveBots() {
    //const resp3 = client.db(db).collection(dbcollection).find()
    //resp3.map(v => console.log('map:',v))
    //const zx = await resp3.toArray()
  }
}



