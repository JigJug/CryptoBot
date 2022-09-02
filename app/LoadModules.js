"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBot = void 0;
const newFtxGetHistoricMarketData_1 = require("./newFtxGetHistoricMarketData");
const CryptoTradingBotTestUpdateEvents_1 = require("./Main/CryptoTradingBotTestUpdateEvents");
const fs = require('fs');
class LoadBot {
    constructor() {
    }
    loadBot() {
        let configPAth = 'D:\\CryptoProject\\DataCollector\\config.json';
        let botConfigRaw = fs.readFileSync(configPAth, "utf8", (err, data) => {
            if (err) {
                console.log(err);
            }
        });
        let botConfig = JSON.parse(botConfigRaw);
        (0, newFtxGetHistoricMarketData_1.FtxGetHistoricMarketData)(botConfig)
            .then((rt) => {
            if (rt.data != null) {
                let marketData = rt.data[rt.data.length - 1];
                console.log(rt.pairing);
                console.log(rt.windowResolution);
                console.log(rt.secretKeyPath);
                console.log(marketData);
                console.log('start new bot instance');
                console.log(marketData.close);
                const NewBot = new CryptoTradingBotTestUpdateEvents_1.CryptoTradingBot(rt.pairing, rt.windowResolution, marketData, rt.secretKeyPath, 0.8954);
                console.log('startbotscript starting bot');
                NewBot.startBot();
            }
        })
            .catch((err) => {
            console.log(err);
        });
    }
}
exports.LoadBot = LoadBot;
