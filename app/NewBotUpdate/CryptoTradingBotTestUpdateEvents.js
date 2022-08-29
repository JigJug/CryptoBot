"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTradingBot = void 0;
const EMA_1 = require("../Main/EMA");
const orcaApiSwapRayUsdcSell_1 = require("../OrcaSwaps/orcaApiSwapRayUsdcSell");
const orcaApiSwapUsdcRayBuy_1 = require("../OrcaSwaps/orcaApiSwapUsdcRayBuy");
const EmiterCollection_1 = require("./EmiterCollection");
class CryptoTradingBot {
    constructor(pairing, windowResolution, marketData, secretkeyPath, ammountUsdc, price) {
        this.pairing = pairing;
        this.windowResolution = windowResolution;
        this.marketData = marketData;
        this.secretkeyPath = secretkeyPath;
        this.ammountUsdc = ammountUsdc;
        this.price = price;
        this.buySellTrigger = true;
        this.bought = true;
        this.sold = false;
        this.ammountCoin = 13;
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
        (0, orcaApiSwapUsdcRayBuy_1.orcaApiSwapBuy)(this.secretkeyPath, this.ammountUsdc)
            .then((ammount) => {
            this.ammountCoin = ammount;
            this.buySellTrigger = true;
            this.bought = true;
            this.sold = false;
        })
            .catch((err) => {
            console.log(err);
        });
    }
    getSell() {
        return this.sell();
    }
    sell() {
        this.buySellTrigger = false;
        (0, orcaApiSwapRayUsdcSell_1.orcaApiSwapSell)(this.secretkeyPath, this.ammountCoin)
            .then((ammount) => {
            this.ammountUsdc = ammount;
            this.buySellTrigger = true;
            this.sold = true;
            this.bought = false;
        })
            .catch((err) => {
            console.log(err);
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
