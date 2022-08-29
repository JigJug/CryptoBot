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
exports.FtxGetHistoricMarketData = void 0;
const FtxApiGetRequest_1 = require("./Main/FtxApiGetRequest");
const StoreDataToJson_1 = require("./Main/StoreDataToJson");
const EMA_1 = require("./Main/EMA");
const readline = __importStar(require("readline"));
function FtxGetHistoricMarketData() {
    return new Promise((resolve, reject) => {
        let botConfig = {
            pairing: '',
            windowResolution: '',
            secretKeyPath: '',
            data: null
        };
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Updating historic market data... \nEnter market: <COIN/PAIRING> ', (answer) => {
            botConfig.pairing = answer;
            rl.question('Enter window resolution <14400> (4h)', (answer2) => {
                botConfig.windowResolution = answer2;
                rl.question('Enter secret key path', (answer3) => {
                    botConfig.secretKeyPath = answer3;
                    let pairing1 = botConfig.pairing.replace('/', '');
                    let emaPeriod = 70;
                    let ftxEndpoint = `https://ftx.com/api`;
                    let endPoint = `${ftxEndpoint}/markets/${botConfig.pairing}/candles?resolution=${botConfig.windowResolution}`;
                    const marketData = new FtxApiGetRequest_1.FtxGetHandler(botConfig.pairing, endPoint);
                    marketData.lastEntry = false;
                    marketData.ftxGetMarket()
                        .then((ret) => {
                        return calcEmaStoreData(ret, emaPeriod, pairing1, botConfig.windowResolution);
                    })
                        .then((md) => {
                        console.log("complete ema");
                        botConfig.data = md;
                        resolve(botConfig);
                    })
                        .catch(err => { console.log('HISTORY ERROR: ' + err); reject(err); });
                    rl.close();
                });
            });
        });
    });
}
exports.FtxGetHistoricMarketData = FtxGetHistoricMarketData;
function calcEmaStoreData(ret, emaPeriod, pairing1, windowResolution) {
    return new Promise((resolve, reject) => {
        let emaYesterday;
        let priceToday;
        const getEMA = new EMA_1.EMA(emaPeriod);
        emaYesterday = getEMA.smaCalc(ret.result);
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
        let newJson = new StoreDataToJson_1.StoreDataJson('D:\\CryptoProject\\DataCollector\\MarketData\\', pairing1, windowResolution);
        newJson.storeToJson(addedEma).then(() => {
            resolve(addedEma);
        })
            .catch((err) => {
            reject('EMA calc ERROR: ' + err);
        });
    });
}
