import EventEmitter from "events";
import { Client } from "./Main/DataClients/dataclient";
import {CryptoTradingBot} from "./Main/index";
import { BotConfig, indicators } from "./typings";
import { createWallet } from "./Main/createwallet/createwallet";

async function startBot(botConfig: BotConfig, events: EventEmitter, id: string, pubkey: string) {
    try {
        //load in cex data client and get historic candle data to calc indicators
        //pass the client and last candle data to a new bot instance
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

        const keyPair = createWallet();
        console.log('keypair generated for new bot')
        console.log(keyPair.publicKey)

        return new CryptoTradingBot(
            id,
            pubkey,
            botConfig,
            indicators,
            client,
            events,
            keyPair
        )
        
    } catch (err) {
        console.error(err)
    }
}

export default startBot



