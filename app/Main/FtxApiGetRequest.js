"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtxGetHandler = void 0;
const NewGetRequest_1 = require("./NewGetRequest");
class FtxGetHandler {
    constructor(marketName, endPoint) {
        this.marketName = marketName;
        this.endPoint = endPoint;
        this.lastEntry = false;
    }
    //methods
    ftxGetMarket() {
        return new Promise((resolve, reject) => {
            const getReq = new NewGetRequest_1.HttpsGetRequest(this.endPoint);
            getReq.httpsGet()
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
