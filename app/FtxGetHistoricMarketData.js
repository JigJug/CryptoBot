"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FtxApiGetRequest_1 = require("./FtxApiGetRequest");
var StoreDataToJson_1 = require("./StoreDataToJson");
var EMA_1 = require("./EMA");
var readline = __importStar(require("readline"));
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var pairing; // 'SRM/USD'
var windowResolution; // = '14400'//4h
rl.question('Enter market: <COIN/PAIRING> ', function (answer) {
    pairing = answer;
    rl.question('Enter window resolution <14400> (4h)', function (answer2) {
        windowResolution = answer2;
        var pairing1 = pairing.replace('/', '');
        var emaPeriod = 70;
        var ftxEndpoint = "https://ftx.com/api";
        var endPoint = ftxEndpoint + "/markets/" + pairing + "/candles?resolution=" + windowResolution;
        var marketData = new FtxApiGetRequest_1.FtxGetHandler(pairing, endPoint);
        //set to true to return the last data entry/ false to get all data
        marketData.lastEntry = false;
        marketData.ftxGetMarket()
            .then(function (ret) {
            return calcEmaStoreData(ret, emaPeriod, pairing1);
        })
            .then(function () {
            console.log("complete");
        })
            .catch(function (err) { console.log(err); });
        rl.close();
    });
});
function calcEmaStoreData(ret, emaPeriod, pairing1) {
    return new Promise(function (resolve, reject) {
        var emaYesterday;
        var priceToday;
        var getEMA = new EMA_1.EMA(emaPeriod, ret.result);
        emaYesterday = getEMA.smaCalc();
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
        //send store data to json (filename: coin + time)
        var newJson = new StoreDataToJson_1.StoreDataJson('D:\\CryptoProject\\DataCollector\\MarketData\\', pairing1, windowResolution, addedEma);
        newJson.storeToJson().then(function () {
            resolve();
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
