"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const CryptoTradingBotNoClass_1 = require("./CryptoTradingBotNoClass");
const fs = require('fs');
//************************************************************************************************************************
//SET UP TRADINGBOT 
let windowResolution = '14400'; //4h
let pairing = 'RAY/USD';
let pairing1 = pairing.replace('/', '');
let ftxEndpoint = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`;
let marketDataEndpoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`;
let path = 'D:\\projs\\DataCollector\\MarketData\\RAYUSD14400.json';
let data = fs.readFileSync(path, "utf8", (err, data) => {
    if (err) {
        console.log(err);
    }
});
let jsonPath = 'D:\\projs\\DataCollector\\MarketData\\';
let Data = JSON.parse(data);
console.log(Data);
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
//check price every 3 seconds
function startPrice() {
    CryptoTradingBotNoClass_1.TradingBotGetters.getPrice(CryptoTradingBotNoClass_1.TradingBotConfig.pairing, CryptoTradingBotNoClass_1.TradingBotConfig.priceEndPoint)
        .then((price) => {
        CryptoTradingBotNoClass_1.TradingBotDynamicData.price = price;
        return;
    })
        .catch((err) => {
        console.log(err);
        return;
    });
}
(0, timers_1.setInterval)(startPrice, 3000);
//4h data
//check the time difference between the last set of 4h data in the marketdata array
//when its above the 4hr limit grab the next set of 4h data from the FTX API 
//calc the ema and update the emaysterday and push the 4h market data with updated ema
CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData = Data;
console.log(CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData[Data.length - 1]);
CryptoTradingBotNoClass_1.TradingBotDynamicData.emaYesterday = Data[Data.length - 1].ema;
(0, timers_1.setInterval)(() => {
}, 60000);
function startFourHour() {
    let time = new Date();
    let timeMills = time.getTime();
    let lastIndex = CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData.length - 1;
    let timeDiff = timeMills - CryptoTradingBotNoClass_1.TradingBotDynamicData.marketData[lastIndex].time;
}
//test everything
(0, timers_1.setInterval)(() => {
    console.log("TradingBotDynamicData.price " + CryptoTradingBotNoClass_1.TradingBotDynamicData.price);
    console.log('\n');
}, 10000);
