import { Client } from "./Main/DataClients/dataclient";
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

        const client = new Client().getClient(botConfig);

        botConfig.data = await client.historicMarketData();

        console.log(botConfig.data);

        if(botConfig.data == null) throw new Error('can not get market data');

        console.log(botConfig.pairing, botConfig.windowResolution, botConfig.data)
        console.log('start new bot instance')

        const indicators: indicators = {
            ema: botConfig.data.ema,
            rsi: 0,
            macd: 0,
            sma: 0
        }

        const newBot = new CryptoTradingBot(
            botConfig,
            indicators,
            client
        )
        
        newBot.startBot();

        console.log('bot started');

    } catch (err) {
        throw err;
    }
}

export default loadBot



