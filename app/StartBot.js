"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoTradingBot_1 = require("./Main/CryptoTradingBot");
const fs = require('fs');
let windowResolution = '14400'; //4h
let pairing = 'RAY/USD';
let pairing1 = pairing.replace('/', '');
let ftxEndpoint = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`;
let marketDataEndpoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`;
let path = 'D:\\projs\\DataCollector\\MarketData\\';
let jsonPath = 'D:\\projs\\DataCollector\\MarketData\\RAYUSD14400.json';
let data = fs.readFileSync(jsonPath, "utf8", (err, data) => {
    if (err) {
        console.log(err);
    }
});
let Data = JSON.parse(data);
let secretKeyPath = '';
const NewBot = new CryptoTradingBot_1.CryptoTradingBot(pairing, Data, endPoint, 0.70, marketDataEndpoint, path, secretKeyPath, 9);
//NewBot.getFourHourData();
//NewBot.getPrice();
console.log(NewBot.ammountCoin);
console.log(NewBot.ammountUsdc);
console.log(NewBot.bought);
console.log(NewBot.buySellTrigger);
console.log(NewBot.emaYesterday);
console.log(NewBot.jsonPath);
console.log(NewBot.marketDataEndpoint);
console.log(NewBot.pairing);
console.log(NewBot.price);
console.log(NewBot.priceEndPoint);
console.log(NewBot.secretkeyPath);
console.log(NewBot.sold);
NewBot.startBot();
