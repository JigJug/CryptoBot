"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtxGetHistoricMarketData = void 0;
const FtxApiGetRequest_1 = require("./Main/FtxApiGetRequest");
const StoreDataToJson_1 = require("./Main/StoreDataToJson");
const EMA_1 = require("./Main/EMA");
function FtxGetHistoricMarketData(botConfig) {
    return new Promise((resolve, reject) => {
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
            .catch(err => {
            console.log('HISTORY ERROR: ' + err);
            reject(err);
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
