import { HttpsGetRequest } from "./NewUpdateGetRequest";
import { FtxApiObject } from "./typings";

export class FtxClient {

    marketName
    windowResolution

    getReq
    ftxEndpoint
    priceEndpoint
    marketDataEndPoint

    
    constructor(marketName: String, windowResolution: string){
        this.marketName = marketName
        this.windowResolution = windowResolution

        this.getReq = new HttpsGetRequest().httpsGet
        this.ftxEndpoint = `https://ftx.com/api`;
        this.priceEndpoint = `${this.ftxEndpoint}/markets/${this.marketName}`
        this.marketDataEndPoint = `${this.priceEndpoint}/candles?resolution=${windowResolution}`
    }

    //methods
    /**
     * @param lastEntry boolean - TRUE: to get the last data entry: only to be used with candle data grab
     * @param endPoint specify the desired ftx endpoint
     * @returns new promise, resolves with ftx data
     */
    ftxGetMarket(lastEntry: boolean, endPoint: string){

        return new Promise<any>((resolve, reject)=>{

            this.getReq(endPoint)
            .then((returnD) => {

                let returnDjson = JSON.parse(returnD);

                if(returnDjson.success == true){
                    if(lastEntry){
                        resolve(returnDjson.result[returnDjson.result.length - 1])
                    }else{
                      resolve(returnDjson)
                    }
                    
                }else{
                    reject(new Error("FTX Error1::: " + returnDjson.error));
                }
            })
            .catch(err => {
                console.log(`ERROR FTXGETREQUEST: ${err}`);
                reject(err);
            })
        })
    }
}

