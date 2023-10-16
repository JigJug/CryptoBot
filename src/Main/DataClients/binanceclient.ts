import { BaseClient } from "../Utils/baseclient";
import { MarketDataObject } from "../../typings";
import { FtxClient } from "./FtxClient";
import calcEmaStoreData from "../Utils/calcema";

function mapBinanceCandleData(data: any): MarketDataObject[] {
    return data.map((v : any) => {
        return {
            stratTime: v[0],
            time: v[6],
            open: parseFloat(v[1]),
            high: parseFloat(v[2]),
            low: parseFloat(v[3]),
            close: parseFloat(v[4]),
            volume: parseFloat(v[5]),
        }
    })
}



interface ClientConfigs {
  symbol: string,
  interval: '15m' | '1h' | '4h' | '1D',
}

class BinanceClient extends BaseClient{

  symbol: string
  endpoints: {[key: string]: string}

  constructor(
    config: ClientConfigs
  ) {
    super('https://api.binance.com/api/v3/');
    this.symbol = config.symbol
    this.endpoints = {
      candleData: `klines?symbol=${this.symbol}&interval=${config.interval}`,
      price: 'ticker/price'
    }
  }

  async historicMarketData(emaLength: number) {
    try {
      const historicCandleData = await this.candleData();
      const data = mapBinanceCandleData(JSON.parse(historicCandleData));
      const dataWithEma: MarketDataObject[] = await calcEmaStoreData(data, emaLength, this.symbol, '300');
      const md = dataWithEma.reverse();
      return md[1]
    } catch (err) {
      throw err;
    }
  }

  async getPrice(){
    const priceRet = await this.price();
    return parseFloat(priceRet.price);
  }

  private candleData() {
    return this.get(this.endpoints.candleData);
  }
  
  private price() {
    return this.get(this.endpoints.price);
  }
}



interface CexClient {
  client: BinanceClient | FtxClient
  config: ClientConfigs;
  historicMarketData: () => Promise<MarketDataObject>;
  getPrice: () => Promise<number>;
}

class Binance implements CexClient {
  client: BinanceClient;
  config: ClientConfigs
  historicMarketData: () => Promise<MarketDataObject>;
  getPrice: () => Promise<number>;;
  constructor(config: ClientConfigs){
    this.config = config
    this.client = new BinanceClient(config)
    this.historicMarketData = () => {
      return this.client.historicMarketData(70);
    }
    this.getPrice = () => {
      return this.client.getPrice();
    }
  } 
}

class GetClient{
  selectClient(client: string, configs: ClientConfigs){
    const clients: Record<string, () => CexClient> = {
      'binance': () => new Binance(configs),
    }
    return clients[client]();
  }
}

class DataClient {
  client: GetClient;
  constructor() {
    this.client = new GetClient();
  }
  getClient(client: string, configs: ClientConfigs) {
    return this.client.selectClient(client, configs)
  }
}

const b = new DataClient();
const c = b.getClient('binance', {symbol: 'SOLUSDT', interval: '4h'}).getPrice();




/*const { WebsocketAPI } = require('@binance/connector')
import { Console } from "console"
const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

// callbacks for different events
const callbacks = {
  open: (client: any) => {
    logger.debug('Connected with Websocket server')
    // send message to get orderbook info after connection open
    //client.orderbook('BTCUSDT')
    //client.orderbook('BNBUSDT', { limit: 10 })
    client.ticker({symbol: 'SOLUSDT'})
    client.avgPrice('SOLUSDT')
    client.ticker24hr({symbol: 'SOLUSDT'})
  },
  close: () => logger.debug('Disconnected with Websocket server'),
  message: (data:any) => logger.info(JSON.parse(data))
}

const websocketAPIClient = new WebsocketAPI(null, null, { logger, callbacks })

// disconnect the connection
//setTimeout(() => websocketAPIClient.disconnect(), 20000)

async function binanceGetHistoricMarketData(baseUrl: string, endPoint: string) {

  const req = new HttpsGetRequest();

  const historicCandleData = await req.httpsGet(`${baseUrl}${endPoint}`);

  const data = mapBinanceCandleData(JSON.parse(historicCandleData));
  const dataWithEma: MarketDataObject[] = await calcEmaStoreData(data, 70, 'SOLUSDT', '300');
  const md = dataWithEma.reverse();

  return md[1]

}


*/