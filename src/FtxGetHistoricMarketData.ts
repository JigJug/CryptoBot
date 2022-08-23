import { FtxGetHandler } from './Main/FtxApiGetRequest'
import { StoreDataJson } from './Main/StoreDataToJson';
import {EMA} from './Main/EMA';
import * as readline from 'readline';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let pairing: string // 'SRM/USD'
let windowResolution: string// = '14400'//4h

rl.question('Enter market: <COIN/PAIRING> ', (answer: string) => {
    pairing = answer;
    rl.question('Enter window resolution <14400> (4h)', (answer2) => {
        windowResolution = answer2;

        let pairing1: string = pairing.replace('/', '')
        let emaPeriod = 70;
        let ftxEndpoint: string = `https://ftx.com/api`;
        let endPoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`

        const marketData = new FtxGetHandler(pairing, endPoint);
        //set to true to return the last data entry/ false to get all data
        marketData.lastEntry = false
        marketData.ftxGetMarket()
        .then((ret)=>{
            return calcEmaStoreData(ret, emaPeriod, pairing1);
        })
        .then(() => {
            console.log("complete")
        })
        .catch(err=>{console.log(err)});


        rl.close()

    })
    
})


function calcEmaStoreData(ret:any, emaPeriod: number, pairing1: string) {

    return new Promise<void>((resolve, reject) => {
        let emaYesterday: any;
        let priceToday: any;

        const getEMA = new EMA(emaPeriod, ret.result);

        emaYesterday = getEMA.smaCalc();
        console.log(emaYesterday)

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
        let newJson = new StoreDataJson('D:\\CryptoProject\\DataCollector\\MarketData\\',pairing1, windowResolution, addedEma);
        newJson.storeToJson().then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}
