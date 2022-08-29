"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FtxGetHistoricMarketData_1 = require("../FtxGetHistoricMarketData");
const CryptoTradingBotTestUpdateEvents_1 = require("../NewBotUpdate/CryptoTradingBotTestUpdateEvents");
let x = 'D:\\CryptoProject\\et\\et.json';
(0, FtxGetHistoricMarketData_1.FtxGetHistoricMarketData)()
    .then((rt) => {
    let marketData = rt.data[rt.data.length - 1];
    console.log(rt.pairing);
    console.log(rt.windowResolution);
    console.log(rt.secretKeyPath);
    console.log(marketData);
    console.log('start new bot instance');
    console.log(marketData.close);
    const NewBot = new CryptoTradingBotTestUpdateEvents_1.CryptoTradingBot(rt.pairing, rt.windowResolution, marketData, rt.secretKeyPath, 0, 0.6749);
    console.log('startbotscript starting bot');
    NewBot.startBot();
})
    .catch((err) => { console.log('ERROR: Could not start bot' + err); });
