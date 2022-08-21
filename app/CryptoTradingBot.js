"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTradingBot = void 0;
var EMA_1 = require("./EMA");
var FtxApiGetRequest_1 = require("./FtxApiGetRequest");
var orcaApiSwap_1 = require("./orcaApiSwap");
var StoreDataToJson_1 = require("./StoreDataToJson");
var fs = require('fs');
var CryptoTradingBot = /** @class */ (function () {
    function CryptoTradingBot(pairing, marketData, priceEndPoint, price, marketDataEndpoint, jsonPath, secretkeyPath) {
        this.pairing = pairing;
        this.marketData = marketData;
        this.priceEndPoint = priceEndPoint;
        this.price = price;
        this.emaYesterday = this.marketData[this.marketData.length - 1].ema;
        this.marketDataEndpoint = marketDataEndpoint;
        this.jsonPath = jsonPath;
        this.buySellTrigger = true;
        this.secretkeyPath = secretkeyPath;
        this.bought = false;
        this.sold = true;
        this.getp = this.getPrice();
        this.getfh = this.getFourHourData();
    }
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
            })
                .catch(function (err) {
                console.log(err);
            });
        }, 5000);
    };
    CryptoTradingBot.prototype.testPrice = function () {
        return this.price;
    };
    CryptoTradingBot.prototype.getFourHourData = function () {
        return this.setFourHourData();
    };
    CryptoTradingBot.prototype.setFourHourData = function () {
        var _this = this;
        if (this.emaYesterday = undefined) {
            this.emaYesterday = this.marketData[this.marketData.length - 1].ema;
        }
        var newMdSet = new FtxApiGetRequest_1.FtxGetHandler(this.pairing, this.marketDataEndpoint);
        newMdSet.lastEntry = true;
        var newEma = new EMA_1.EMA(70, this.marketData);
        var time = new Date();
        //let timeMills = time.getTime();
        var fourHour = 1000 * 60 * 60 * 4;
        setInterval(function () {
            var timeMills = time.getTime();
            var lastIndex = _this.marketData.length - 1;
            if (timeMills - _this.marketData[lastIndex].time > fourHour) {
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
        }, 60000);
    };
    CryptoTradingBot.prototype.readFile = function () {
        fs.readFileSync('', "utf8", function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    };
    CryptoTradingBot.prototype.buy = function () {
        var orcaApi = orcaApiSwap_1.orcaApiSwap(this.secretkeyPath, 'SRM', 'USDC');
        while (true) {
            if (this.price > this.emaYesterday) {
                if (this.buySellTrigger && this.sold) {
                    this.buySellTrigger = false;
                }
            }
        }
    };
    return CryptoTradingBot;
}());
exports.CryptoTradingBot = CryptoTradingBot;
