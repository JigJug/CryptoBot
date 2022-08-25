"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const FtxApiGetRequest_1 = require("./Main/FtxApiGetRequest");
const StoreDataToJson_1 = require("./Main/StoreDataToJson");
const EMA_1 = require("./Main/EMA");
const readline = __importStar(require("readline"));
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let pairing; // 'SRM/USD'
let windowResolution; // = '14400'//4h
rl.question('Enter market: <COIN/PAIRING> ', (answer) => {
    pairing = answer;
    rl.question('Enter window resolution <14400> (4h)', (answer2) => {
        windowResolution = answer2;
        let pairing1 = pairing.replace('/', '');
        let emaPeriod = 70;
        let ftxEndpoint = `https://ftx.com/api`;
        let endPoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`;
        const marketData = new FtxApiGetRequest_1.FtxGetHandler(pairing, endPoint);
        //set to true to return the last data entry/ false to get all data
        marketData.lastEntry = false;
        marketData.ftxGetMarket()
            .then((ret) => {
            return calcEmaStoreData(ret, emaPeriod, pairing1);
        })
            .then(() => {
            console.log("complete");
        })
            .catch(err => { console.log(err); });
        rl.close();
    });
});
function calcEmaStoreData(ret, emaPeriod, pairing1) {
    return new Promise((resolve, reject) => {
        let emaYesterday;
        let priceToday;
        const getEMA = new EMA_1.EMA(emaPeriod, ret.result);
        emaYesterday = getEMA.smaCalc();
        console.log(emaYesterday);
        ret.result[emaPeriod].ema = emaYesterday;
        const calcEma = (currentValue, index) => {
            if (index > emaPeriod) {
                priceToday = currentValue.close;
                currentValue.ema = getEMA.emaCalc(priceToday, emaYesterday);
                emaYesterday = currentValue.ema;
            }
            return currentValue;
        };
        let addedEma = ret.result.map(calcEma);
        //send store data to json (filename: coin + time)
        let newJson = new StoreDataToJson_1.StoreDataJson('D:\\projs\\DataCollector\\MarketData\\', pairing1, windowResolution);
        newJson.storeToJson(addedEma).then(() => {
            resolve();
        })
            .catch((err) => {
            reject(err);
        });
    });
}
