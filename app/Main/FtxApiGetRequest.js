"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtxGetHandler = void 0;
const NewUpdateGetRequest_1 = require("./NewUpdateGetRequest");
class FtxGetHandler {
    constructor(marketName, endPoint) {
        this.marketName = marketName;
        this.endPoint = endPoint;
        this.lastEntry = false;
    }
    //methods
    ftxGetMarket() {
        return new Promise((resolve, reject) => {
            const getReq = new NewUpdateGetRequest_1.HttpsGetRequest();
            getReq.httpsGet(this.endPoint)
                .then((returnD) => {
                let returnDjson = JSON.parse(returnD);
                if (returnDjson.success == true) {
                    if (this.lastEntry) {
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
exports.FtxGetHandler = FtxGetHandler;
