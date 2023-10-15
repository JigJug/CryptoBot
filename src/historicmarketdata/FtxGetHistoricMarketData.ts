import { FtxClient } from '../Main/DataClients/FtxClient'
import { BotConfig} from '../typings';
import calcEmaStoreData from './calcema';

export function FtxGetHistoricMarketData(botConfig: BotConfig){
    return new Promise<BotConfig>((resolve, reject) => {
          
        let pairing1: string = botConfig.pairing.replace('/', '')
        let emaPeriod = 70;
        let ftxEndpoint: string = `https://ftx.com/api`;
        let endPoint = `${ftxEndpoint}/markets/${botConfig.pairing}/candles?resolution=${botConfig.windowResolution}`
              
        const marketData = new FtxClient(botConfig.pairing, botConfig.windowResolution);
        marketData.ftxGetMarket(false, marketData.marketDataEndPoint)
        .then((ret)=>{
            return calcEmaStoreData(ret.result, emaPeriod, pairing1, botConfig.windowResolution);
        })
        .then((md) => {
            console.log("ema complete")
            botConfig.data = md
            resolve(botConfig)
        })
        .catch(err=>{
            console.log('HISTORY ERROR: '+err);
            reject(err)
        });
    
    })
}
