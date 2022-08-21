"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTradingBot = void 0;
var EMA_1 = require("./EMA");
var FtxApiGetRequest_1 = require("./FtxApiGetRequest");
var orcaApiSwapRayUsdcSell_1 = require("./orcaApiSwapRayUsdcSell");
var orcaApiSwapUsdcRayBuy_1 = require("./orcaApiSwapUsdcRayBuy");
var StoreDataToJson_1 = require("./StoreDataToJson");
var fs = require('fs');
var CryptoTradingBot = /** @class */ (function () {
    function CryptoTradingBot(pairing, marketData, priceEndPoint, price, marketDataEndpoint, jsonPath, secretkeyPath, ammountUsdc) {
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
    CryptoTradingBot.prototype.startBot = function () {
        return this.setStartBot();
    };
    CryptoTradingBot.prototype.setStartBot = function () {
        this.getPrice();
        this.getFourHourData();
        this.getBuy();
        this.getSell();
    };
    //current price
    CryptoTradingBot.prototype.getPrice = function () {
        return this.setPrice();
    };
    CryptoTradingBot.prototype.setPrice = function () {
        var _this = this;
        var price = new FtxApiGetRequest_1.FtxGetHandler(this.pairing, this.priceEndPoint);
        setInterval(function () {
            price.ftxGetMarket()
                .then(function (ret) {
                _this.price = ret.result.price;
                //console.log(this.price)
            })
                .catch(function (err) {
                console.log(err);
            });
        }, 5000);
    };
    CryptoTradingBot.prototype.testPrice = function () {
        return this.price;
    };
    //4hour data
    CryptoTradingBot.prototype.getFourHourData = function () {
        return this.setFourHourData();
    };
    CryptoTradingBot.prototype.setFourHourData = function () {
        var _this = this;
        var newMdSet = new FtxApiGetRequest_1.FtxGetHandler(this.pairing, this.marketDataEndpoint);
        newMdSet.lastEntry = true;
        var newEma = new EMA_1.EMA(70, this.marketData);
        //let timeMills = time.getTime();
        var fourHour = 1000 * 60 * 60 * 4;
        setInterval(function () {
            var time = new Date();
            var timeMills = time.getTime();
            var lastIndex = _this.marketData.length - 1;
            var timeDiff = timeMills - _this.marketData[lastIndex].time;
            if (timeDiff > fourHour) {
                newMdSet.ftxGetMarket()
                    .then(function (md) {
                    md.ema = newEma.emaCalc(md.close, _this.emaYesterday);
                    _this.emaYesterday = md.ema;
                    _this.marketData.push(md);
                    var storeJson = new StoreDataToJson_1.StoreDataJson(_this.jsonPath, _this.pairing.replace('/', ''), '14400', _this.marketData);
                    storeJson.storeToJson();
                })
                    .catch(function (err) {
                    console.log(err);
                });
            }
            console.log('time: ' + time + '\n'
                + 'price: ' + _this.testPrice() + '\n'
                + 'ema: ' + _this.emaYesterday + '\n'
                + 'timenow: ' + timeMills + '\n'
                + 'timediff: ' + timeDiff + '\n'
                + 'bought: ' + _this.bought + '\n'
                + 'sold: ' + _this.sold + '\n');
        }, 320000);
    };
    //buying and selling
    CryptoTradingBot.prototype.getBuy = function () {
        return this.buy;
    };
    CryptoTradingBot.prototype.buy = function () {
        var _this = this;
        setInterval(function () {
            if (_this.price > _this.emaYesterday) {
                if (_this.buySellTrigger && _this.sold) {
                    _this.buySellTrigger = false;
                    orcaApiSwapUsdcRayBuy_1.orcaApiSwapBuy(_this.secretkeyPath, _this.ammountUsdc)
                        .then(function (ammount) {
                        _this.ammountCoin = ammount;
                        _this.buySellTrigger = true;
                        _this.bought = true;
                    })
                        .catch(function (err) {
                        console.log(err);
                    });
                }
            }
        }, 3000);
    };
    CryptoTradingBot.prototype.getSell = function () {
        return this.sell();
    };
    CryptoTradingBot.prototype.sell = function () {
        var _this = this;
        setInterval(function () {
            if (_this.price < _this.emaYesterday) {
                if (_this.buySellTrigger && _this.bought) {
                    _this.buySellTrigger = false;
                    orcaApiSwapRayUsdcSell_1.orcaApiSwapSell(_this.secretkeyPath, _this.ammountUsdc)
                        .then(function (ammount) {
                        _this.ammountUsdc = ammount;
                        _this.buySellTrigger = true;
                        _this.sold = true;
                    })
                        .catch(function (err) {
                        console.log(err);
                    });
                }
            }
        }, 3000);
    };
    return CryptoTradingBot;
}());
exports.CryptoTradingBot = CryptoTradingBot;
