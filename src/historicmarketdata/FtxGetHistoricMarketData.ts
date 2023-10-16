import { FtxClient } from '../Main/DataClients/FtxClient'
import { BotConfig, MarketDataObject} from '../typings';
import calcEmaStoreData from '../Main/Utils/calcema';

export async function FtxGetHistoricMarketData(botConfig: BotConfig){
    let pairing1: string = botConfig.pairing.replace('/', '')
    let emaPeriod = 70;
    let ftxEndpoint: string = `https://ftx.com/api`;
    let endPoint = `${ftxEndpoint}/markets/${botConfig.pairing}/candles?resolution=${botConfig.windowResolution}` 
    const marketData = new FtxClient(botConfig.pairing, botConfig.windowResolution);
    const ret = await marketData.ftxGetMarket(false, marketData.marketDataEndPoint)
    const md: MarketDataObject[] = await calcEmaStoreData(ret.result, emaPeriod, pairing1, botConfig.windowResolution);
    const mdr = md.reverse();
    return mdr[0]

}
