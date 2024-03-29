import {
  BotConfig,
  DataClientHandler,
  Endpoints,
  MarketDataObject,
} from "../../../typings";
import { BaseApiClient } from "../baseclient";
import calcEmaStoreData from "./calcema";

export class BinanceClient extends BaseApiClient implements DataClientHandler {
  constructor(endpoints: Endpoints) {
    super(endpoints);
  }

  async processHistoricData(config: BotConfig) {
    const mapBinanceCandleData = (data: any): MarketDataObject[] => {
      console.log("mapping data");
      return data.map((v: any) => {
        return {
          startTime: v[0],
          time: v[6],
          open: parseFloat(v[1]),
          high: parseFloat(v[2]),
          low: parseFloat(v[3]),
          close: parseFloat(v[4]),
          volume: parseFloat(v[5]),
        };
      });
    };

    try {
      const historicCandleData = await this.candleData();
      console.log(this.endpoints.candleData);
      const data = mapBinanceCandleData(JSON.parse(historicCandleData));
      const dataWithEma = await calcEmaStoreData(
        data,
        parseInt(config.emaInterval),
        config.pairing,
        "300"
      );
      const md = dataWithEma.reverse();
      return md[1];
    } catch (err) {
      throw err;
    }
  }

  async processPrice() {
    try {
      const priceRet = await this.price();
      return parseFloat(JSON.parse(priceRet).price);
    } catch (err) {
      throw err;
    }
  }
}
