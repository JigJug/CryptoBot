import { getHistoricMarketData } from "./historicmarketdata";
import {CryptoTradingBot} from "./Main/index";
import { BotConfig, indicators } from "./typings";
import * as fs from 'fs';

function getBotConfigs(): BotConfig {
    let configPAth = 'D:\\CryptoProject\\BotConfigs\\config.json'
    let botConfigRaw = fs.readFileSync(configPAth, "utf8");
    return JSON.parse(botConfigRaw);
}

async function loadBot() {
    try {

        const botConfig = getBotConfigs();

        const rt = await getHistoricMarketData(botConfig);

        if(rt.data == null) throw new Error('can not get market data');

        let marketData = rt.data[rt.data.length - 1]
        console.log(rt.pairing, rt.windowResolution, marketData)
        console.log('start new bot instance')

        const indicators: indicators = {
            ema: marketData.ema,
            rsi: 0,
            macd: 0,
            sma: 0
        }

        const NewBot = new CryptoTradingBot(
            rt.pairing,
            rt.windowResolution,
            marketData,
            rt.secretKeyPath,
            marketData.close,
            rt.dex,
            rt.stopLoss,
            indicators
        )
        
        NewBot.startBot();

        console.log('bot started');

    } catch (err) {
        throw err;
    }
}

export default loadBot



