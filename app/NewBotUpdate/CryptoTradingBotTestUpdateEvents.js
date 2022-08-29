"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTradingBot = void 0;
const EMA_1 = require("../Main/EMA");
const orcaApiSwapRayUsdcSell_1 = require("../OrcaSwaps/orcaApiSwapRayUsdcSell");
const orcaApiSwapUsdcRayBuy_1 = require("../OrcaSwaps/orcaApiSwapUsdcRayBuy");
const EmiterCollection_1 = require("./EmiterCollection");
class CryptoTradingBot {
    constructor(pairing, windowResolution, marketData, jsonPath, secretkeyPath, ammountUsdc, price) {
        this.pairing = pairing;
        this.windowResolution = windowResolution;
        this.marketData = marketData;
        this.jsonPath = jsonPath;
        this.secretkeyPath = secretkeyPath;
        this.ammountUsdc = ammountUsdc;
        this.price = price;
        this.buySellTrigger = true;
        this.bought = false;
        this.sold = true;
        this.ammountCoin = 0;
        this.dataEmiters = new EmiterCollection_1.EmiterCollection(this.pairing, this.windowResolution);
    }
    startBot() {
        return this.setStartBot();
    }
    setStartBot() {
        this.getPrice();
        this.getFourHourData();
    }
    //current price
    getPrice() {
        return this.setPrice();
    }
    setPrice() {
        this.dataEmiters.sendPrice();
        this.dataEmiters.on('Price', (price) => {
            this.price = price;
            this.buySellLigic(price, this.marketData.ema);
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
        let lastIndex = this.marketData.length - 1;
        let lastTime = this.marketData[lastIndex].time;
        this.dataEmiters.sendFourHourData(lastTime);
        this.dataEmiters.on('FourHourData', (md) => {
            //calc ema
            const newEma = new EMA_1.EMA(70, []);
            md.ema = newEma.emaCalc(md.close, this.marketData.ema);
            //assign new marketData
            this.marketData.startTime = md.startTime;
            this.marketData.time = md.time;
            this.marketData.open = md.open;
            this.marketData.high = md.high;
            this.marketData.low = md.low;
            this.marketData.close = md.close;
            this.marketData.volume = md.volume;
            this.marketData.ema = md.ema;
            console.log('updated market data: \n' + this.marketData);
        });
    }
    //buying and selling
    buySellLigic(price, emaYesterday) {
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
        (0, orcaApiSwapUsdcRayBuy_1.orcaApiSwapBuy)(this.secretkeyPath, this.ammountUsdc)
            .then((ammount) => {
            this.ammountCoin = ammount;
            this.buySellTrigger = true;
            this.bought = true;
        })
            .catch((err) => {
            console.log(err);
        });
    }
    getSell() {
        return this.sell();
    }
    sell() {
        (0, orcaApiSwapRayUsdcSell_1.orcaApiSwapSell)(this.secretkeyPath, this.ammountCoin)
            .then((ammount) => {
            this.ammountUsdc = ammount;
            this.buySellTrigger = true;
            this.sold = true;
        })
            .catch((err) => {
            console.log(err);
        });
    }
}
exports.CryptoTradingBot = CryptoTradingBot;
