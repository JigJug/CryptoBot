import { FtxClient } from './Main/CexClients/FtxClient'
import { StoreDataJson } from './Main/StoreDataToJson';
import {EMA} from './Main/Strategy/Indicators/EMA';
import { SMA } from './Main/Strategy/Indicators/SMA';
import { BotConfig} from './Main/typings';

export function FtxGetHistoricMarketData(botConfig: BotConfig){
    return new Promise<BotConfig>((resolve, reject) => {
          
        let pairing1: string = botConfig.pairing.replace('/', '')
        let emaPeriod = 70;
        let ftxEndpoint: string = `https://ftx.com/api`;
        let endPoint = `${ftxEndpoint}/markets/${botConfig.pairing}/candles?resolution=${botConfig.windowResolution}`
              
        const marketData = new FtxClient(botConfig.pairing, botConfig.windowResolution);
        marketData.ftxGetMarket(false, marketData.marketDataEndPoint)
        .then((ret)=>{
            return calcEmaStoreData(ret, emaPeriod, pairing1, botConfig.windowResolution);
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




function calcEmaStoreData(ret:any, emaPeriod: number, pairing1: string, windowResolution: string) {

    return new Promise<any>((resolve, reject) => {
        let emaYesterday: any;
        let priceToday: any;

        const getEMA = new EMA(emaPeriod);
        const getSMA = new SMA(emaPeriod);

        emaYesterday = getSMA.smaCalc(ret.result);
        ret.result[emaPeriod].ema = emaYesterday;
    
        const calcEma = (currentValue: any, index: any) => {
            if(index > emaPeriod){
                priceToday = currentValue.close;
                currentValue.ema = getEMA.emaCalc(priceToday, emaYesterday);
                emaYesterday = currentValue.ema;
            }
            return currentValue
        }
    
        let addedEma = ret.result.map(calcEma);
    
        //send store data to json (filename: coin + time)
        let newJson = new StoreDataJson('D:\\CryptoProject\\DataCollector\\MarketData\\',pairing1, windowResolution);
        newJson.storeToJson(addedEma).then(() => {
            resolve(addedEma);
        })
        .catch((err) => {
            reject('EMA calc ERROR: '+err);
        })
    })
}
