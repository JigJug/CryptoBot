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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listeners = void 0;
const fatbotcontroller_1 = require("./fatbotcontroller");
const events_1 = require("events");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080; //8080;
const events = new events_1.EventEmitter();
const botController = new fatbotcontroller_1.FatBotController();
function bot(id, pubkey) {
    return botController.bots[pubkey][id];
}
/*function getBotConfigs(): BotConfig {
  let configPAth = 'D:\\CryptoProject\\BotConfigs\\config.json'
  let botConfigRaw = fs.readFileSync(configPAth, "utf8");
  return JSON.parse(botConfigRaw);
}*/
//events.on('newbot', (config: BotConfig, pubkey: string) => {
//  botController.startBot(config, pubkey, events);
//})
function getPrice() {
    events.on('SingleMarketData', (price, id, pubkey) => {
        const cb = bot(id, pubkey);
        cb.price = price;
        cb.strategy.buySellLogic(price, cb.indicators, cb.sold, cb.bought, cb.buySellTrigger);
    });
}
function getTimeFrameData() {
    events.on('TimeFrameData', (md, id, pubkey) => {
        var _a;
        const cb = bot(id, pubkey);
        console.log(md);
        cb.updateIndicators(md);
        cb.updateMarketData(md);
        console.log('updated market data: \n' + ((_a = cb.marketData) === null || _a === void 0 ? void 0 : _a.time) + '\n');
        console.log('ema:: ', cb.indicators.ema);
    });
}
//buying and selling
function buySellListeners() {
    events.on('Buy', (buy, id, pubkey) => {
        const cb = bot(id, pubkey);
        console.log('recieved buy signal');
        if (buy && cb.buySellTrigger && cb.sold) {
            cb.getBuy();
        }
    });
    events.on('Sell', (sell, id, pubkey) => {
        const cb = bot(id, pubkey);
        console.log('recieved sell signal');
        if (sell && cb.buySellTrigger && cb.bought) {
            cb.getSell();
        }
    });
}
function listeners() {
    getPrice();
    getTimeFrameData();
    buySellListeners();
}
exports.listeners = listeners;
listeners();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', (req, res, next) => {
    //res.set('Access-Control-Allow-Origin', '*');
    res.send('HELLO FROM BOT GET REQUEST');
});
app.post('/botdeets', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const del = () => {
        return new Promise(res => setTimeout(res, 2000));
    };
    const id = req.body.body.id;
    const pubkey = req.body.body.pubkey;
    if (!(pubkey in botController.bots)) {
        res.send('no data');
        return next();
    }
    const curBot = bot(id, pubkey);
    //const {usdc, sol} = await curBot.checkBalance();
    const response = {
        time: (_a = curBot.marketData) === null || _a === void 0 ? void 0 : _a.time,
        price: curBot.price,
        ema: curBot.indicators.ema,
        volume: (_b = curBot.marketData) === null || _b === void 0 ? void 0 : _b.volume,
        bought: `${curBot.bought}`,
        sold: `${curBot.sold}`,
        //usdc: `${usdc.toFixed(5)}`,
        //sol: `${sol.toFixed(5)}`
    };
    res.send(response);
    return next();
}));
app.post('/loadbot', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const body = req.body.body;
    //res.set('Access-Control-Allow-Origin', '*');
    const id = yield botController.loadbot(req.body.body.config, req.body.body.pubkey, events);
    //console.log(bot(id, body.pubkey).keyPair?.publicKey.toString())
    console.log(botController.bots);
    res.send("CyQBLYTw1o1y38trQ1aYEBUAaRc5m26GTQHzscNwgqiB"); //bot(id, body.pubkey).keyPair?.publicKey.toString());
    bot(id, body.pubkey).startBot();
    next();
}));
app.post('/startbot', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const body = req.body.body;
    bot(body.id, body.pubkey).startBot();
    res.send('bot started');
    next();
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
