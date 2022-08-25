"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingBotDynamicData = exports.TradingBotConfig = void 0;
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
/*export const TradingBotGetters = {
    getPrice: function (pairing: string, priceEndpoint: string) {
        return fetchPrice(pairing, priceEndpoint);
    },
    getFourHourData: function (TradingBotConfig: TradingBotConfigType) {
        return fetchFourHourData(TradingBotConfig)
    }
}*/
//METHODS
//price
/*function fetchPrice(pairing: string, priceEndpoint: string){
    return new Promise<number>((resolve, reject) => {
        const price = new FtxGetHandler(pairing, priceEndpoint);
        price.ftxGetMarket()
        .then((ret) => {
            resolve(ret.result.price)
            //console.log("logging price at fetchPrice ::: " + ret.result.price)
        })
        .catch((err) =>{
            console.log(err);
            reject(err)
        })
    })
}*/
/*function fetchFourHourData(pairing: string, marketDataEndpoint: string, emaYesterday: number, timeDiff: number, fourHour: number){
    return new Promise<any>((resolve, reject) => {
        const newMdSet = new FtxGetHandler(pairing, marketDataEndpoint);
        newMdSet.lastEntry = true
        const newEma = new EMA(70, []);
        //let timeMills = time.getTime();
        let fourHour = 1000 * 60 * 60 * 4;
        if(timeDiff > fourHour){

            newMdSet.ftxGetMarket()
            .then((md) => {

                md.ema = newEma.emaCalc(md.close, emaYesterday);
                this.emaYesterday = md.ema;
                this.marketData.push(md);

                const storeJson = new StoreDataJson(
                    this.jsonPath,
                    this.pairing.replace('/', ''),
                    '14400',
                    this.marketData
                );
                storeJson.storeToJson();
            })
            .catch((err) => {
                console.log(err)
            });

        }

    })

}*/ 
