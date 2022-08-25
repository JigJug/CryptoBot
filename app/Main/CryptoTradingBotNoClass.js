"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingBotGetters = exports.TradingBotDynamicData = exports.TradingBotConfig = void 0;
const EMA_1 = require("./EMA");
const FtxApiGetRequest_1 = require("./FtxApiGetRequest");
const StoreDataToJson_1 = require("./StoreDataToJson");
const fs = require('fs');
//bot config
exports.TradingBotConfig = {
    pairing: '',
    priceEndPoint: '',
    marketDataEndpoint: '',
    jsonPath: '',
    secretkeyPath: ''
};
//bot dynamic data
exports.TradingBotDynamicData = {
    marketData: null,
    price: null,
    emaYesterday: null,
    buySellTrigger: null,
    bought: null,
    sold: null,
    ammountUsd: null,
    ammountCoin: null
};
//bot functions
exports.TradingBotGetters = {
    getPrice: function (pairing, priceEndpoint) {
        return fetchPrice(pairing, priceEndpoint);
    },
    getFourHourData: function (TradingBotConfig) {
        return fetchFourHourData(TradingBotConfig);
    }
};
//METHODS
//price
function fetchPrice(pairing, priceEndpoint) {
    return new Promise((resolve, reject) => {
        const price = new FtxApiGetRequest_1.FtxGetHandler(pairing, priceEndpoint);
        price.ftxGetMarket()
            .then((ret) => {
            resolve(ret.result.price);
            //console.log("logging price at fetchPrice ::: " + ret.result.price)
        })
            .catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
function fetchFourHourData(pairing, marketDataEndpoint, emaYesterday, timeDiff, fourHour) {
    return new Promise((resolve, reject) => {
        const newMdSet = new FtxApiGetRequest_1.FtxGetHandler(pairing, marketDataEndpoint);
        newMdSet.lastEntry = true;
        const newEma = new EMA_1.EMA(70, []);
        //let timeMills = time.getTime();
        let fourHour = 1000 * 60 * 60 * 4;
        if (timeDiff > fourHour) {
            newMdSet.ftxGetMarket()
                .then((md) => {
                md.ema = newEma.emaCalc(md.close, emaYesterday);
                this.emaYesterday = md.ema;
                this.marketData.push(md);
                const storeJson = new StoreDataToJson_1.StoreDataJson(this.jsonPath, this.pairing.replace('/', ''), '14400', this.marketData);
                storeJson.storeToJson();
            })
                .catch((err) => {
                console.log(err);
            });
        }
    });
}
