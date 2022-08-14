"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtxGetHandler = void 0;
var NewGetRequest_1 = require("./NewGetRequest");
var StoreDataToJson_1 = require("./StoreDataToJson");
var FtxGetHandler = /** @class */ (function () {
    function FtxGetHandler(marketName, resolution, start_time, end_time) {
        this.marketName = marketName;
        //this.endPoint = endPoint
        this.resolution = resolution;
        this.lastEntry = false;
        this.start_time = start_time;
        this.end_time = end_time;
    }
    //methods
    FtxGetHandler.prototype.ftxGetMarketHistory = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var ftxEndpoint = "https://ftx.com/api";
            var endPoint = ftxEndpoint + "/markets/" + _this.marketName + "/candles?resolution=" + _this.resolution; //
            if (_this.start_time != null) {
                endPoint = endPoint + ("&start_time=" + _this.start_time); //&end_time=${this.end_time}`
            }
            var getReq = new NewGetRequest_1.NewGetRequest(endPoint);
            getReq.httpsGet()
                .then(function (returnD) {
                var returnDjson = JSON.parse(returnD);
                //console.log(returnDjson)
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
                //console.log("error1::: " + returnDjson.sucess);
                //console.log(returnDjson);
            })
                .catch(function (err) {
                console.log("ERROR: " + err);
                reject(err);
            });
        });
    };
    return FtxGetHandler;
}());
exports.FtxGetHandler = FtxGetHandler;
var EMA_1 = require("./EMA");
var pairing = 'SHIB/USD';
var pairing1 = pairing.replace('/', '');
var windowResolution = '14400'; //4h
var emaPeriod = 70;
var emaYesterday;
var priceToday;
//example usage script
//get the history from ftx - returns market data
//loop through the data and calculate the ema
//store data to json for bot usage 
//FtxGetHandler(pairing, time interval: 86400 = 1d)
var marketData = new FtxGetHandler(pairing, windowResolution);
//set to true to return the last data entry/ false to get all data
marketData.lastEntry = false;
marketData.ftxGetMarketHistory()
    .then(function (ret) {
    var getEMA = new EMA_1.EMA(emaPeriod, ret.result);
    emaYesterday = getEMA.smaCalc(ret.result);
    ret.result[emaPeriod].ema = emaYesterday;
    var calcEma = function (currentValue, index) {
        if (index > emaPeriod) {
            priceToday = currentValue.close;
            currentValue.ema = getEMA.emaCalc(priceToday, emaYesterday);
            emaYesterday = currentValue.ema;
        }
        return currentValue;
    };
    var addedEma = ret.result.map(calcEma);
    console.log(addedEma);
    //send store data to json (filename: coin + time)
    var newJson = new StoreDataToJson_1.StoreDataJson(pairing1, windowResolution, addedEma);
    newJson.storeToJson();
})
    .catch(function (err) { console.log(err); });
