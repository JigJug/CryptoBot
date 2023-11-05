"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataclient_1 = require("./Main/DataClients/dataclient");
const index_1 = require("./Main/index");
function loadBot(botConfig, events, id, pubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //load in cex data client and get historic candle data to calc indicators
            //pass the client and last candle data to a new bot instance
            const client = new dataclient_1.Client().getClient(botConfig);
            botConfig.data = yield client.historicMarketData();
            console.log(botConfig.data);
            if (botConfig.data == null)
                throw new Error('can not get market data');
            console.log(botConfig.pairing, botConfig.windowResolution, botConfig.data);
            console.log('start new bot instance');
            const indicators = {
                ema: botConfig.data.ema,
                rsi: 0,
                macd: 0,
                sma: 0
            };
            //const keyPair = createWallet();
            //console.log('keypair generated for new bot')
            //console.log(keyPair.publicKey)
            return new index_1.CryptoTradingBot(id, pubkey, botConfig, indicators, client, events);
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = loadBot;
