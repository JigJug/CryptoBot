"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const CryptoTradingBotNoClass_1 = require("./CryptoTradingBotNoClass");
const FtxApiGetRequest_1 = require("./FtxApiGetRequest");
const EMA_1 = require("./EMA");
const StoreDataToJson_1 = require("./StoreDataToJson");
const orcaApiSwapRayUsdcSell_1 = require("../OrcaSwaps/orcaApiSwapRayUsdcSell");
const orcaApiSwapUsdcRayBuy_1 = require("../OrcaSwaps/orcaApiSwapUsdcRayBuy");
const fs = require('fs');
//************************************************************************************************************************
//SET UP TRADINGBOT 
let windowResolution = '14400'; //4h
let pairing = 'RAY/USD';
let pairing1 = pairing.replace('/', '');
let ftxEndpoint = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`;
let marketDataEndpoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`;
let path = 'D:\\projs\\DataCollector\\MarketData\\RAYUSD60.json';
let data = fs.readFileSync(path, "utf8", (err, data) => {
    if (err) {
        console.log(err);
    }
});
let jsonPath = 'D:\\projs\\DataCollector\\MarketData\\';
let Data = JSON.parse(data);
//console.log(Data)
let secretKeyPath = '';
// load everythig from a json config file. done need to explicity declare this stuff in the script
// all data can come from user input.
//assign the user configs
CryptoTradingBotNoClass_1.TradingBotConfig.marketDataEndpoint = marketDataEndpoint;
CryptoTradingBotNoClass_1.TradingBotConfig.jsonPath = jsonPath;
CryptoTradingBotNoClass_1.TradingBotConfig.pairing = pairing;
CryptoTradingBotNoClass_1.TradingBotConfig.priceEndPoint = endPoint;
CryptoTradingBotNoClass_1.TradingBotConfig.secretkeyPath = secretKeyPath;
//************************************************************************************************************************
//************************************************************************************************************************
//************************************************************************************************************************
//************************************************************************************************************************
//PRICE AND EMA AND ROUTINE CHECKING
CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger = true;
CryptoTradingBotNoClass_1.TradingBotDynamicData.bought = false;
CryptoTradingBotNoClass_1.TradingBotDynamicData.sold = false;
//check price every 3 seconds
const price = new FtxApiGetRequest_1.FtxGetHandler(CryptoTradingBotNoClass_1.TradingBotConfig.pairing, CryptoTradingBotNoClass_1.TradingBotConfig.priceEndPoint);
(0, timers_1.setInterval)(startPrice, 3000);
function startPrice() {
    fetchPrice()
        .then((price) => {
        CryptoTradingBotNoClass_1.TradingBotDynamicData.price = price;
        return;
    })
        .catch((err) => {
        console.log(err);
        return;
    });
}
function fetchPrice() {
    return new Promise((resolve, reject) => {
        price.ftxGetMarket()
            .then((ret) => {
            resolve(ret.result.price);
        })
            .catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
//4h data
//check the time difference between the last set of 4h data in the marketdata array
//when its above the 4hr limit grab the next set of 4h data from the FTX API 
//calc the ema and update the emaysterday and push the 4h market data with updated ema
const newMdSet = new FtxApiGetRequest_1.FtxGetHandler(pairing, marketDataEndpoint);
newMdSet.lastEntry = true;
CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData = Data;
const newEma = new EMA_1.EMA(70, CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData);
console.log(CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData[Data.length - 1]);
CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday = Data[Data.length - 1].ema;
let fourHour = 1000 * 60;
const storeJson = new StoreDataToJson_1.StoreDataJson(CryptoTradingBotNoClass_1.TradingBotConfig.jsonPath, CryptoTradingBotNoClass_1.TradingBotConfig.pairing.replace('/', ''), '14400');
(0, timers_1.setInterval)(startFourHourData, 30000);
function startFourHourData() {
    fetchFourHourData(CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday, fourHour)
        .catch((err) => {
        console.log(err);
    });
}
function fetchFourHourData(emaYesterday, fourHour) {
    return new Promise((resolve, reject) => {
        let time = new Date();
        let timeMills = time.getTime();
        let lastIndex = CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData.length - 1;
        let timeDiff = timeMills - CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData[lastIndex].time;
        if (timeDiff > fourHour) {
            newMdSet.ftxGetMarket()
                .then((md) => {
                md.ema = newEma.emaCalc(md.close, emaYesterday);
                CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday = md.ema;
                CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData.push(md);
                storeJson.storeToJson(CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData);
                resolve();
            })
                .catch((err) => {
                console.log(err);
                reject(err);
            });
        }
    });
}
CryptoTradingBotNoClass_1.TradingBotDynamicData.ammountCoin = 200;
CryptoTradingBotNoClass_1.TradingBotDynamicData.ammountUsdc = 200;
(0, timers_1.setInterval)(() => {
    if (CryptoTradingBotNoClass_1.TradingBotDynamicData.price > CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday) {
        if (CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger && CryptoTradingBotNoClass_1.TradingBotDynamicData.sold) {
            CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger = false;
            (0, orcaApiSwapUsdcRayBuy_1.orcaApiSwapBuy)(CryptoTradingBotNoClass_1.TradingBotConfig.secretkeyPath, CryptoTradingBotNoClass_1.TradingBotDynamicData.ammountUsdc)
                .then((ammount) => {
                CryptoTradingBotNoClass_1.TradingBotDynamicData.ammountCoin = ammount;
                CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger = true;
                CryptoTradingBotNoClass_1.TradingBotDynamicData.bought = true;
            })
                .catch((err) => {
                console.log(err);
            });
        }
    }
}, 3000);
(0, timers_1.setInterval)(() => {
    if (CryptoTradingBotNoClass_1.TradingBotDynamicData.price < CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday) {
        if (CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger && CryptoTradingBotNoClass_1.TradingBotDynamicData.bought) {
            CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger = false;
            (0, orcaApiSwapRayUsdcSell_1.orcaApiSwapSell)(CryptoTradingBotNoClass_1.TradingBotConfig.secretkeyPath, CryptoTradingBotNoClass_1.TradingBotDynamicData.ammountUsdc)
                .then((ammount) => {
                CryptoTradingBotNoClass_1.TradingBotDynamicData.ammountUsdc = ammount;
                CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger = true;
                CryptoTradingBotNoClass_1.TradingBotDynamicData.sold = true;
            })
                .catch((err) => {
                console.log(err);
            });
        }
    }
}, 3000);
//test everything
(0, timers_1.setInterval)(() => {
    console.log("TradingBotDynamicData.price " + CryptoTradingBotNoClass_1.TradingBotDynamicData.price);
    console.log('\n');
    console.log("TradingBotDynamicData.emaYesterday " + CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday);
    console.log('\n');
    console.log("TradingBotDynamicData.buySellTrigger " + CryptoTradingBotNoClass_1.TradingBotDynamicData.buySellTrigger);
    console.log('\n');
    console.log("TradingBotDynamicData.bought " + CryptoTradingBotNoClass_1.TradingBotDynamicData.bought);
    console.log('\n');
    console.log("TradingBotDynamicData.sold " + CryptoTradingBotNoClass_1.TradingBotDynamicData.sold);
    console.log('\n');
    console.log("TradingBotDynamicData.price " + CryptoTradingBotNoClass_1.TradingBotDynamicData.price);
    console.log('\n');
}, 10000);
