import { FtxGetHandler } from './FtxApiGetHandlerMarketData'
import { StoreDataJson } from './StoreDataToJson'
import {EMA} from './EMA'

let pairing: string = 'SRM/USD'
let pairing1: string = pairing.replace('/', '')
let windowResolution: string = '14400'//4h
let emaPeriod = 70;
let emaYesterday: any;
let priceToday: any;
let ftxEndpoint: string = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`

//example usage script
//get the history from ftx - returns market data
//loop through the data and calculate the ema
//store data to json for bot usage 
//FtxGetHandler(pairing, time interval: 86400 = 1d)
const marketData = new FtxGetHandler(pairing, endPoint);
//set to true to return the last data entry/ false to get all data
marketData.lastEntry = false
marketData.ftxGetMarket()
.then((ret)=>{
    return calcEmaStoreData(ret);
})
.then(() => {
    console.log("complete")
})
.catch(err=>{console.log(err)});


function calcEmaStoreData(ret:any, ) {

    return new Promise<void>((resolve, reject) => {

        const getEMA = new EMA(emaPeriod, ret.result);

        emaYesterday = getEMA.smaCalc(ret.result);

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
    
        console.log(addedEma)
    
        //send store data to json (filename: coin + time)
        let newJson = new StoreDataJson(pairing1, windowResolution, addedEma);
        newJson.storeToJson().then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })

}