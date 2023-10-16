import { StoreDataJson } from './StoreDataToJson';
import {EMA} from '../Strategy/Indicators/EMA';
import { SMA } from '../Strategy/Indicators/SMA';

function calcEmaStoreData(data:any, emaPeriod: number, pairing1: string, windowResolution: string) {

    return new Promise<any>((resolve, reject) => {
        let emaYesterday: any;
        let priceToday: any;

        const getEMA = new EMA(emaPeriod);
        const getSMA = new SMA(emaPeriod);

        emaYesterday = getSMA.smaCalc(data);
        data[emaPeriod].ema = emaYesterday;
    
        const calcEma = (currentValue: any, index: any) => {
            if(index > emaPeriod){
                priceToday = currentValue.close;
                currentValue.ema = getEMA.emaCalc(priceToday, emaYesterday);
                emaYesterday = currentValue.ema;
            }
            return currentValue
        }
    
        let addedEma = data.map(calcEma);
    
        //send store data to json (filename: coin + time)
        let newJson = new StoreDataJson('D:\\CryptoProject\\CryptoBot\\MarketData\\',pairing1, windowResolution);
        newJson.storeToJson(addedEma).then(() => {
            resolve(addedEma);
        })
        .catch((err) => {
            reject('EMA calc ERROR: '+err);
        })
    })
}

export default calcEmaStoreData