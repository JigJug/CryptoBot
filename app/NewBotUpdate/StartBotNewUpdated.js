"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FtxGetHistoricMarketData_1 = require("../FtxGetHistoricMarketData");
const CryptoTradingBotTestUpdateEvents_1 = require("../NewBotUpdate/CryptoTradingBotTestUpdateEvents");
(0, FtxGetHistoricMarketData_1.FtxGetHistoricMarketData)()
    .then((rt) => {
    let marketData = rt.data[rt.data.length - 1];
    const NewBot = new CryptoTradingBotTestUpdateEvents_1.CryptoTradingBot(rt.pairing, rt.windowResolution, marketData, rt.secretKeyPath, 0, 0.6672);
    NewBot.startBot();
    console.log(NewBot.ammountCoin);
    console.log(NewBot.ammountUsdc);
    console.log(NewBot.bought);
    console.log(NewBot.buySellTrigger);
    console.log(NewBot.pairing);
    console.log(NewBot.price);
    console.log(NewBot.secretkeyPath);
    console.log(NewBot.sold);
})
    .catch(() => { console.log('ERROR: Could not start bot'); });
