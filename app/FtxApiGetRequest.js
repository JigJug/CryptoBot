"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtxGetHandler = void 0;
var NewGetRequest_1 = require("./NewGetRequest");
var FtxGetHandler = /** @class */ (function () {
    function FtxGetHandler(marketName, endPoint) {
        this.marketName = marketName;
        this.endPoint = endPoint;
        this.lastEntry = false;
    }
    //methods
    FtxGetHandler.prototype.ftxGetMarket = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var getReq = new NewGetRequest_1.HttpsGetRequest(_this.endPoint);
            getReq.httpsGet()
                .then(function (returnD) {
                var returnDjson = JSON.parse(returnD);
                if (returnDjson.success == true) {
                    if (_this.lastEntry) {
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
                .catch(function (err) {
                console.log("ERROR FTXGETREQUEST: " + err);
                reject(err);
            });
        });
    };
    return FtxGetHandler;
}());
exports.FtxGetHandler = FtxGetHandler;
