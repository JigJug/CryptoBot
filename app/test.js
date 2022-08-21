"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoTradingBot_1 = require("./CryptoTradingBot");
var fs = require('fs');
var windowResolution = '14400'; //4h
var pairing = 'SRM/USD';
var pairing1 = pairing.replace('/', '');
var ftxEndpoint = "https://ftx.com/api";
var endPoint = ftxEndpoint + "/markets/" + pairing;
var path = 'D:\\CryptoProject\\DataCollector\\MarketData\\SRMUSD14400.json';
var lastData = fs.readFileSync(path, "utf8", function (err, data) {
    if (err) {
        console.log(err);
    }
});
lastData = JSON.parse(lastData);
lastData = lastData[lastData.length - 1];
console.log(lastData.ema);
var NewBot = new CryptoTradingBot_1.CryptoTradingBot(pairing, [], endPoint);
setInterval(function () {
    console.log(NewBot.testPrice());
}, 15000);
