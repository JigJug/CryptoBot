"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTradingBot = void 0;
const EMA_1 = require("./EMA");
const FtxApiGetRequest_1 = require("./FtxApiGetRequest");
const orcaApiSwapRayUsdcSell_1 = require("../OrcaSwaps/orcaApiSwapRayUsdcSell");
const orcaApiSwapUsdcRayBuy_1 = require("../OrcaSwaps/orcaApiSwapUsdcRayBuy");
const StoreDataToJson_1 = require("./StoreDataToJson");
const fs = require('fs');
class CryptoTradingBot {
    constructor(pairing, marketData, priceEndPoint, price, marketDataEndpoint, jsonPath, secretkeyPath, ammountUsdc) {
        this.pairing = pairing;
        this.marketData = marketData;
        this.priceEndPoint = priceEndPoint;
        this.price = price;
        this.marketDataEndpoint = marketDataEndpoint;
        this.jsonPath = jsonPath;
        this.secretkeyPath = secretkeyPath;
        this.emaYesterday = this.marketData[this.marketData.length - 1].ema;
        this.buySellTrigger = true;
        this.secretkeyPath = secretkeyPath;
        this.bought = false;
        this.sold = true;
        this.ammountUsdc = ammountUsdc;
        this.ammountCoin = 0;
    }
    startBot() {
        return this.setStartBot();
    }
    setStartBot() {
        this.getPrice();
        this.getFourHourData();
        this.getBuy();
        this.getSell();
    }
    //current price
    getPrice() {
        return this.setPrice();
    }
    setPrice() {
        const price = new FtxApiGetRequest_1.FtxGetHandler(this.pairing, this.priceEndPoint);
        setInterval(() => {
            price.ftxGetMarket()
                .then((ret) => {
                this.price = ret.result.price;
                //console.log(this.price)
            })
                .catch((err) => {
                console.log(err);
            });
        }, 5000);
    }
    testPrice() {
        return this.price;
    }
    //4hour data
    getFourHourData() {
        return this.setFourHourData();
    }
    setFourHourData() {
        const newMdSet = new FtxApiGetRequest_1.FtxGetHandler(this.pairing, this.marketDataEndpoint);
        newMdSet.lastEntry = true;
        const newEma = new EMA_1.EMA(70, this.marketData);
        //let timeMills = time.getTime();
        let fourHour = 1000 * 60 * 60 * 4;
        setInterval(() => {
            let time = new Date();
            let timeMills = time.getTime();
            let lastIndex = this.marketData.length - 1;
            let timeDiff = timeMills - this.marketData[lastIndex].time;
            if (timeDiff > fourHour) {
                newMdSet.ftxGetMarket()
                    .then((md) => {
                    md.ema = newEma.emaCalc(md.close, this.emaYesterday);
                    this.emaYesterday = md.ema;
                    this.marketData.push(md);
                    const storeJson = new StoreDataToJson_1.StoreDataJson(this.jsonPath, this.pairing.replace('/', ''), '14400', this.marketData);
                    storeJson.storeToJson();
                })
                    .catch((err) => {
                    console.log(err);
                });
            }
            console.log('time: ' + time + '\n'
                + 'price: ' + this.testPrice() + '\n'
                + 'ema: ' + this.emaYesterday + '\n'
                + 'timenow: ' + timeMills + '\n'
                + 'timediff: ' + timeDiff + '\n'
                + 'bought: ' + this.bought + '\n'
                + 'sold: ' + this.sold + '\n');
        }, 320000);
    }
    //buying and selling
    getBuy() {
        return this.buy;
    }
    buy() {
        setInterval(() => {
            if (this.price > this.emaYesterday) {
                if (this.buySellTrigger && this.sold) {
                    this.buySellTrigger = false;
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
            }
        }, 3000);
    }
    getSell() {
        return this.sell();
    }
    sell() {
        setInterval(() => {
            if (this.price < this.emaYesterday) {
                if (this.buySellTrigger && this.bought) {
                    this.buySellTrigger = false;
                    (0, orcaApiSwapRayUsdcSell_1.orcaApiSwapSell)(this.secretkeyPath, this.ammountUsdc)
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
        }, 3000);
    }
}
exports.CryptoTradingBot = CryptoTradingBot;
