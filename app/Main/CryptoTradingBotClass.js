"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const ExchangeLoader_1 = require("./DexClients/ExchangeLoader");
const CheckWalletBalances_1 = require("./Utils/CheckWalletBalances");
const LoadStrategy_1 = require("./Strategy/LoadStrategy");
const marketdata_1 = require("./marketdata");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class CryptoTradingBot {
    constructor(id, pubkey, botConfig, indicators, dataClient, events) {
        var _a;
        this.id = id;
        this.pubkey = pubkey;
        this.pairing = botConfig.pairing;
        this.windowResolution = botConfig.windowResolution;
        this.marketData = botConfig.data;
        this.price = (_a = botConfig.data) === null || _a === void 0 ? void 0 : _a.close;
        this.dex = botConfig.dex;
        this.stopLoss = botConfig.stopLoss;
        this.indicators = indicators;
        this.buySellTrigger = true;
        this.bought = false;
        this.sold = false;
        (() => __awaiter(this, void 0, void 0, function* () {
            const amm = yield (0, CheckWalletBalances_1.getBalance)('');
            if (amm < 3) {
                this.bought = true;
                this.sold = false;
            }
            else {
                this.bought = false;
                this.sold = true;
            }
        }))();
        this.coin = 'SOL';
        //load the data and dex clients, emitters, secretkey and strategy
        this.events = events;
        this.dataClient = dataClient;
        this.marketDataController = this.setMarketDataController();
        this.dexClient = this.setDex();
        this.strategy = this.setStrategy();
        //this.keyPair = keyPair
        this.secretKeyPath = process.env.SECRET_KEY_PATH;
        this.secretKey = process.env.SECRET_KEY_PATH; //this.setSecretKeyDev();//keyPair.secretKey
        console.log(this.secretKey);
    }
    setMarketDataController() {
        return new marketdata_1.MarketDataController(this.dataClient, this.events, this.id, this.pubkey);
    }
    setStrategy() {
        return this.getStrategy();
    }
    getStrategy() {
        return new LoadStrategy_1.Strategy('simpleema').loadStrategy(this.stopLoss, this.events, this.id, this.pubkey);
    }
    setDex() {
        return new ExchangeLoader_1.LoadExchange(this.dex).swapClient();
    }
    startBot() {
        this.setStartBot();
    }
    setStartBot() {
        this.setPrice();
        this.setTimeFrameData();
        this.botStatusUpdate();
    }
    //current price
    setPrice() {
        return this.getPrice();
    }
    getPrice() {
        this.marketDataController.sendPrice();
    }
    //market data
    setTimeFrameData() {
        return this.getTimeFrameData();
    }
    getTimeFrameData() {
        var _a;
        let lastTime = (_a = this.marketData) === null || _a === void 0 ? void 0 : _a.time;
        this.marketDataController.sendTimeFrameData(lastTime);
    }
    getBuy() {
        return this.buy('buy');
    }
    buy(side) {
        console.log('buy signal');
        this.buySellTrigger = false;
        (0, CheckWalletBalances_1.getBalance)('USD')
            .then((bal) => {
            return this.dexClient(bal, side, this.secretKey, this.pairing);
        })
            .then(() => {
            console.log('bought');
            this.buySellTrigger = true;
            this.bought = true;
            this.sold = false;
        })
            .catch((err) => {
            console.log(err);
            this.buySellTrigger = true;
        });
    }
    getSell() {
        return this.sell('sell');
    }
    sell(side) {
        /*if(!this.bought && !this.sold) {
            this.sold = true;
            return
        }*/
        this.buySellTrigger = false;
        (0, CheckWalletBalances_1.getBalance)(this.coin)
            .then((bal) => {
            return this.dexClient(bal, side, this.secretKey, this.pairing);
        })
            .then(() => {
            this.buySellTrigger = true;
            this.sold = true;
            this.bought = false;
        })
            .catch((err) => {
            console.log(err);
            this.buySellTrigger = true;
        });
    }
    botStatusUpdate() {
        setInterval(() => {
            var _a, _b;
            console.log(`lastdatatime: ${(_a = this.marketData) === null || _a === void 0 ? void 0 : _a.startTime}\n
                price: ${this.price}\n
                volume: ${(_b = this.marketData) === null || _b === void 0 ? void 0 : _b.volume}\n
                bought: ${this.bought}\n
                sold: ${this.sold}\n
                buyselltrigger : ${this.buySellTrigger}`);
        }, 120000);
    }
    updateMarketData(md) {
        console.log('updating market data');
        this.marketData.startTime = md.startTime;
        this.marketData.time = md.time;
        this.marketData.open = md.open;
        this.marketData.high = md.high;
        this.marketData.low = md.low;
        this.marketData.close = md.close;
        this.marketData.volume = md.volume;
    }
    updateIndicators(md) {
        this.indicators = this.strategy.updateIndicators(md, this.indicators);
    }
    setSecretKeyDev() {
        return this.getSecretKeyDev();
    }
    getSecretKeyDev() {
        //let secretKeyString = fs.readFileSync(this.secretKeyPath, "utf8");
        //const secretKey: SecretKeyObj = JSON.parse(secretKeyString);
        //return secretKey.pk;
    }
    stopBot() {
        this.marketDataController.clearIntervals();
    }
    checkBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const usdc = yield (0, CheckWalletBalances_1.getBalance)('');
            yield (() => new Promise(res => setTimeout(res, 1000)))();
            const sol = yield (0, CheckWalletBalances_1.getBalance)(this.coin);
            return { usdc, sol };
        });
    }
}
exports.default = CryptoTradingBot;
