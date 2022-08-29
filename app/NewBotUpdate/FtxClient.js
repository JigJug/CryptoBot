"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtxClient = void 0;
const NewGetRequest_1 = require("./NewGetRequest");
class FtxClient {
    constructor(marketName, windowResolution) {
        this.marketName = marketName;
        this.windowResolution = windowResolution;
        this.getReq = new NewGetRequest_1.HttpsGetRequest().httpsGet;
        this.ftxEndpoint = `https://ftx.com/api`;
        this.priceEndpoint = `${this.ftxEndpoint}/markets/${this.marketName}`;
        this.marketDataEndPoint = `${this.priceEndpoint}/candles?resolution=${windowResolution}`;
    }
    //methods
    /**
     * @param lastEntry boolean - TRUE: to get the last data entry: only to be used with candle data grab
     * @param endPoint specify the desired ftx endpoint
     * @returns new promise, resolves with ftx data
     */
    ftxGetMarket(lastEntry, endPoint) {
        return new Promise((resolve, reject) => {
            this.getReq(endPoint)
                .then((returnD) => {
                let returnDjson = JSON.parse(returnD);
                if (returnDjson.success == true) {
                    if (lastEntry) {
                        resolve(returnDjson.result[returnDjson.result.length - 1]);
                    }
                    else {
                        resolve(returnDjson);
                    }
                }
                else {
                    reject(new Error("FTX Error1::: " + returnDjson.error));
                }
            })
                .catch(err => {
                console.log(`ERROR FTXGETREQUEST: ${err}`);
                reject(err);
            });
        });
    }
}
exports.FtxClient = FtxClient;
