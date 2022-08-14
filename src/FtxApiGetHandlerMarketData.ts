
import { NewGetRequest } from "./NewGetRequest";
import { StoreDataJson } from "./StoreDataToJson";

//ftx get response type
type FtxApiObject = {
    success: Boolean;
    result: [];
}

export class FtxGetHandler {

    marketName: String
    resolution: String
    //endPoint: String
    lastEntry: boolean
    start_time?: String
    end_time?: String

    

    constructor(marketName: String, resolution: String, start_time?: String, end_time?: String){//, endPoint: String){
        this.marketName = marketName
        //this.endPoint = endPoint
        this.resolution = resolution
        this.lastEntry = false
        this.start_time = start_time
        this.end_time = end_time
    }

    //methods
    ftxGetMarketHistory(){

        return new Promise<any>((resolve, reject)=>{

            let ftxEndpoint: string = `https://ftx.com/api`;
            let endPoint: String = `${ftxEndpoint}/markets/${this.marketName}/candles?resolution=${this.resolution}`;//
            if(this.start_time != null){
                endPoint = endPoint + `&start_time=${this.start_time}`//&end_time=${this.end_time}`
            }

            const getReq = new NewGetRequest(endPoint);
    
            getReq.httpsGet()
            .then((returnD) => {

                let returnDjson = JSON.parse(returnD);
                //console.log(returnDjson)
                if(returnDjson.success == true){
                    if(this.lastEntry){
                        resolve(returnDjson.result[returnDjson.result.length - 1])
                    }else{
                      resolve(returnDjson)  
                    }
                    
                }else{
                    reject(new Error("FTX Error1::: " + returnDjson.error));
                }
                //console.log("error1::: " + returnDjson.sucess);
                //console.log(returnDjson);
            })
            .catch(err => {
                console.log(`ERROR: ${err}`);
                reject(err);
            })
        })
    }
}



import {EMA} from './EMA'

let pairing: string = 'SHIB/USD'
let pairing1: string = pairing.replace('/', '')
let windowResolution: string = '14400'//4h
let emaPeriod = 70;
let emaYesterday: any;
let priceToday: any;

//example usage script
//get the history from ftx - returns market data
//loop through the data and calculate the ema
//store data to json for bot usage 
//FtxGetHandler(pairing, time interval: 86400 = 1d)
const marketData = new FtxGetHandler(pairing, windowResolution);
//set to true to return the last data entry/ false to get all data
marketData.lastEntry = false
marketData.ftxGetMarketHistory()
.then((ret)=>{
    
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
    newJson.storeToJson();
})
.catch(err=>{console.log(err)});


