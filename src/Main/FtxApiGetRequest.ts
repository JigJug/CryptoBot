import { HttpsGetRequest } from "./NewGetRequest";

//ftx get response type
type FtxApiObject = {
    success: Boolean;
    result: [];
}

export class FtxGetHandler {

    marketName: string | null
    endPoint: string | null
    lastEntry: boolean | null

    constructor(marketName: string | null, endPoint: string | null){
        this.marketName = marketName
        this.endPoint = endPoint
        this.lastEntry = false
    }

    //methods
    ftxGetMarket(){

        return new Promise<any>((resolve, reject)=>{

            const getReq = new HttpsGetRequest(this.endPoint);
    
            getReq.httpsGet()
            .then((returnD) => {

                let returnDjson = JSON.parse(returnD);

                if(returnDjson.success == true){
                    if(this.lastEntry){
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

