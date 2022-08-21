"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoTradingBot_1 = require("./CryptoTradingBot");
var fs = require('fs');
var windowResolution = '14400'; //4h
var pairing = 'RAY/USD';
var pairing1 = pairing.replace('/', '');
var ftxEndpoint = "https://ftx.com/api";
var endPoint = ftxEndpoint + "/markets/" + pairing;
var marketDataEndpoint = ftxEndpoint + "/markets/" + pairing + "/candles?resolution=" + windowResolution;
var path = 'D:\\CryptoProject\\DataCollector\\MarketData\\';
var data = fs.readFileSync(path, "utf8", function (err, data) {
    if (err) {
        console.log(err);
    }
});
var Data = JSON.parse(data);
var secretKeyPath = '';
var NewBot = new CryptoTradingBot_1.CryptoTradingBot(pairing, Data, endPoint, 0.70, marketDataEndpoint, path, secretKeyPath, 9);
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
