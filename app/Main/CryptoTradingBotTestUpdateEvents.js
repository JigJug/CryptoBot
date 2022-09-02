"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTradingBot = void 0;
const EMA_1 = require("./EMA");
const orcaApiSwapOrcaUsdcSell_1 = require("./DexClients/OrcaSwaps/orcaApiSwapOrcaUsdcSell");
const orcaApiSwapUsdcOrcaBuy_1 = require("./DexClients/OrcaSwaps/orcaApiSwapUsdcOrcaBuy");
const CheckWalletBalances_1 = require("./CheckWalletBalances");
const EmiterCollection_1 = require("./EmiterCollection");
class CryptoTradingBot {
    constructor(pairing, windowResolution, marketData, secretkeyPath, price) {
        this.pairing = pairing;
        this.windowResolution = windowResolution;
        this.marketData = marketData;
        this.secretkeyPath = secretkeyPath;
        this.price = price;
        this.buySellTrigger = true;
        this.bought = false;
        this.sold = true;
        this.ammountUsdc = 0;
        this.ammountCoin = 0;
        this.dataEmiters = new EmiterCollection_1.EmiterCollection(this.pairing, this.windowResolution);
        this.ema = new EMA_1.EMA(70);
        this.timeMills = 0;
        this.timeDiff = 0;
    }
    startBot() {
        console.log(' cryptobotclass:: running startBot');
        return this.setStartBot();
    }
    setStartBot() {
        this.getPrice();
        this.getFourHourData();
        this.botStatusUpdate();
    }
    //current price
    getPrice() {
        return this.setPrice();
    }
    setPrice() {
        this.dataEmiters.sendPrice();
        this.dataEmiters.on('Price', (price) => {
            this.price = price;
            this.buySellLogic(price, this.marketData.ema);
        });
    }
    testPrice() {
        return this.price;
    }
    //4hour data
    getFourHourData() {
        return this.setFourHourData();
    }
    setFourHourData() {
        let lastTime = this.marketData.time;
        let wr = parseInt(this.windowResolution);
        this.dataEmiters.sendFourHourData(lastTime, wr);
        this.dataEmiters.on('FourHourData', (md) => {
            console.log('set4hrdata');
            md.ema = this.calcEma(md.close, this.marketData.ema);
            this.updateMarketData(md);
            console.log('updated market data: \n' + this.marketData.time + '\n');
        });
    }
    //buying and selling
    buySellLogic(price, emaYesterday) {
        //buy
        if (price > emaYesterday) {
            if (this.buySellTrigger && this.sold) {
                this.buySellTrigger = false;
                this.getBuy();
            }
        }
        else if (this.price < emaYesterday) {
            if (this.buySellTrigger && this.bought) {
                this.buySellTrigger = false;
                this.getSell();
            }
        }
    }
    getBuy() {
        return this.buy();
    }
    buy() {
        this.buySellTrigger = false;
        (0, CheckWalletBalances_1.getBalance)(true)
            .then((bal) => {
            this.ammountUsdc = bal;
            return (0, orcaApiSwapUsdcOrcaBuy_1.orcaApiSwapBuy)(this.secretkeyPath, bal);
        })
            .then(() => {
            this.buySellTrigger = true;
            this.bought = true;
            this.sold = false;
        })
            .catch((err) => {
            console.log(err);
            //this.buy();
        });
    }
    getSell() {
        return this.sell();
    }
    sell() {
        this.buySellTrigger = false;
        (0, CheckWalletBalances_1.getBalance)(false)
            .then((bal) => {
            this.ammountCoin = bal;
            return (0, orcaApiSwapOrcaUsdcSell_1.orcaApiSwapSell)(this.secretkeyPath, bal);
        })
            .then(() => {
            this.buySellTrigger = true;
            this.sold = true;
            this.bought = false;
        })
            .catch((err) => {
            console.log(err);
            //this.sell();
        });
    }
    calcEma(close, emaYesterday) {
        console.log('calcing ema');
        const ema = this.ema;
        return ema.emaCalc(close, emaYesterday);
    }
    botStatusUpdate() {
        this.dataEmiters.on('BotStatusUpdate', (timeMills, timeDiff) => {
            this.timeMills = timeMills;
            this.timeDiff = timeDiff;
        });
        setInterval(() => {
            console.log('timenow: ' + this.timeMills);
            console.log('lastdatatime: ' + this.marketData.time);
            console.log('timediff: ' + this.timeDiff);
            console.log('price: ' + this.price);
            console.log('ema: ' + this.marketData.ema);
            console.log('volume: ' + this.marketData.volume);
            console.log('bought: ' + this.bought);
            console.log('sold: ' + this.sold + '\n');
            console.log('ammount usd = ' + this.ammountUsdc);
            console.log('ammount coin = ' + this.ammountCoin);
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
        this.marketData.ema = md.ema;
        console.log('updating market data : EMA = ' + this.marketData.ema);
    }
}
exports.CryptoTradingBot = CryptoTradingBot;
