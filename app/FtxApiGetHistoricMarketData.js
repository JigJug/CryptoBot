"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FtxApiGetHandlerMarketData_1 = require("./FtxApiGetHandlerMarketData");
var StoreDataToJson_1 = require("./StoreDataToJson");
var EMA_1 = require("./EMA");
var pairing = 'SRM/USD';
var pairing1 = pairing.replace('/', '');
var windowResolution = '14400'; //4h
var emaPeriod = 70;
var emaYesterday;
var priceToday;
var ftxEndpoint = "https://ftx.com/api";
var endPoint = ftxEndpoint + "/markets/" + pairing + "/candles?resolution=" + windowResolution;
//example usage script
//get the history from ftx - returns market data
//loop through the data and calculate the ema
//store data to json for bot usage 
//FtxGetHandler(pairing, time interval: 86400 = 1d)
var marketData = new FtxApiGetHandlerMarketData_1.FtxGetHandler(pairing, endPoint);
//set to true to return the last data entry/ false to get all data
marketData.lastEntry = false;
marketData.ftxGetMarket()
    .then(function (ret) {
    return calcEmaStoreData(ret);
})
    .then(function () {
    console.log("complete");
})
    .catch(function (err) { console.log(err); });
function calcEmaStoreData(ret) {
    return new Promise(function (resolve, reject) {
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
        newJson.storeToJson().then(function () {
            resolve();
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
