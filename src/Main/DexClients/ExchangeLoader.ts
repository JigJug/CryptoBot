import { dexRouter } from "./swapfactory";

export class LoadExchange {
  exchange;
  constructor(exchange: string) {
    this.exchange = exchange;
  }
  swapClient() {
    return dexRouter(this.exchange)
  }
}
