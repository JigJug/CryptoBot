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

        let botConfig = getBotConfigs();

        botConfig.data = await getHistoricMarketData(botConfig);

        if(botConfig.data == null) throw new Error('can not get market data');

        console.log(botConfig.pairing, botConfig.windowResolution, botConfig.data)
        console.log('start new bot instance')

        const indicators: indicators = {
            ema: botConfig.data.ema,
            rsi: 0,
            macd: 0,
            sma: 0
        }

        const NewBot = new CryptoTradingBot(
            botConfig.pairing,
            botConfig.windowResolution,
            botConfig.data,
            botConfig.secretKeyPath,
            botConfig.data.close,
            botConfig.dex,
            botConfig.stopLoss,
            indicators
        )
        
        NewBot.startBot();

        console.log('bot started');

    } catch (err) {
        throw err;
    }
}

export default loadBot



