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
exports.MarketDataController = void 0;
class MarketDataController {
    constructor(client, eventEmitter, id, pubkey) {
        this.client = client;
        this.eventEmitter = eventEmitter;
        this.id = id;
        this.pubkey = pubkey;
        this.priceInterval = null;
        this.mdInterval = null;
    }
    sendPrice() {
        const fetcPrice = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const price = yield this.client.getPrice();
                this.eventEmitter.emit('SingleMarketData', price, this.id, this.pubkey);
            }
            catch (err) {
                console.log(err);
            }
        });
        this.priceInterval = setInterval(() => {
            fetcPrice();
        }, 5000);
    }
    sendTimeFrameData(lastTime) {
        let TimeFrame = 1000 * 300; //need something to convert numbers to binance naming eg 300 = 4h //parseInt(this.client.config.windowResolution);
        let timeMills;
        let timeDiff;
        const routineData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const getMarketData = yield this.client.historicMarketData();
                this.eventEmitter.emit('TimeFrameData', getMarketData, this.id, this.pubkey);
            }
            catch (err) {
                console.log(err);
            }
        });
        this.mdInterval = setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime;
            //console.log(timeMills, timeDiff, TimeFrame)
            if (timeDiff > TimeFrame) {
                lastTime = lastTime + TimeFrame;
                routineData();
            }
        }, 6000);
    }
    clearIntervals() {
        clearInterval(this.priceInterval);
        clearInterval(this.mdInterval);
    }
}
exports.MarketDataController = MarketDataController;
