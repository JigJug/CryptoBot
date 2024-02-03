import {
  BotConfig,
  DataClientHandler,
  Endpoints,
  MarketDataObject,
} from "../../../typings";
import { computeAmmountOut } from "../../DexClients/RaydiumSwaps/RaydiumUtils";
import { BaseApiClient } from "../baseclient";
import calcEmaStoreData from "./calcema";

export class RaydiumClient implements DataClientHandler {
  constructor() {
  }

  async processHistoricData(config: BotConfig) {
    return {
      startTime: '0',
      time: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
      ema: 0
    }
  }

  async processPrice() {
    try {
      computeAmmountOut()
    } catch (err) {
      throw err;
    }
  }
}

  