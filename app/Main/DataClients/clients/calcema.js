"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMA_1 = require("../../Strategy/Indicators/EMA");
const SMA_1 = require("../../Strategy/Indicators/SMA");
function calcEmaStoreData(data, emaPeriod, pairing, windowResolution) {
    return new Promise((resolve, reject) => {
        let emaYesterday;
        let priceToday;
        const getEMA = new EMA_1.EMA(emaPeriod);
        const getSMA = new SMA_1.SMA(emaPeriod);
        emaYesterday = getSMA.smaCalc(data);
        data[emaPeriod].ema = emaYesterday;
        const calcEma = (currentValue, index) => {
            if (index > emaPeriod) {
                priceToday = currentValue.close;
                currentValue.ema = getEMA.emaCalc(priceToday, emaYesterday);
                emaYesterday = currentValue.ema;
            }
            return currentValue;
        };
        let addedEma = data.map(calcEma);
        resolve(addedEma);
        //store data to json (filename: coin + time)
        //let newJson = new StoreDataJson(`.\\MarketData\\`,pairing.replace('/', ''), windowResolution);
        //newJson.storeToJson(addedEma).then(() => {
        //    resolve(addedEma);
        //}).catch((err) => {
        //    reject('EMA calc ERROR: '+err);
        //})
    });
}
exports.default = calcEmaStoreData;
