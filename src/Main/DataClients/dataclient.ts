import { BotConfig, DataClientHandler } from "../../typings";
import { endpoints } from "./endpoints";
import { BinanceClient } from "./handlers/binancehandler";


class GetDataClientHandler {
  getDch(config: BotConfig){
    const eps = endpoints(config);
    const cdh: Record<string, () => DataClientHandler>  = {
      binance: () => new BinanceClient(eps),
    }
    return cdh[config.cexData]();
  }
}

export class DataClient {

  private dataHandler: DataClientHandler;
  config: BotConfig;

  constructor(
    dataHandler: DataClientHandler,
    config: BotConfig
  ){
    this.dataHandler = dataHandler;
    this.config = config
  }

  historicMarketData() {
    return this.dataHandler.processHistoricData(this.config);
  }

  getPrice() {
    return this.dataHandler.processPrice()
  }

}

export class Client {
  getClient(config: BotConfig){
    return new DataClient(
      new GetDataClientHandler().getDch(config),
      config
    );
  }
}


