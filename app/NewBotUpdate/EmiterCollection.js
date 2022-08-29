"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmiterCollection = void 0;
const FtxClient_1 = require("./FtxClient");
const events_1 = require("events");
class EmiterCollection extends events_1.EventEmitter {
    constructor(marketname, windowResolution) {
        super();
        this.marketName = marketname;
        this.windowResolution = windowResolution;
        this.exchangeClient = new FtxClient_1.FtxClient(this.marketName, this.windowResolution);
    }
    sendPrice() {
        let cli = this.exchangeClient;
        setInterval(() => {
            cli.ftxGetMarket(false, cli.priceEndpoint)
                .then((ret) => {
                this.emit('Price', ret.result.price);
            })
                .catch((err) => {
                console.log(err);
            });
        }, 5000);
    }
    sendFourHourData(lastTime, windowResolution) {
        let cli = this.exchangeClient;
        let fourHour = 1000 * windowResolution;
        let timeMills;
        let timeDiff;
        setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime;
            console.log('timediff = ' + timeDiff);
            if (timeDiff > fourHour) {
                lastTime = lastTime + fourHour;
                cli.ftxGetMarket(true, cli.marketDataEndPoint)
                    .then((md) => {
                    this.emit('FourHourData', md);
                })
                    .catch((err) => {
                    console.log(err);
                });
            }
            this.emit('BotStatusUpdate', timeMills, timeDiff);
        }, 6000);
    }
}
exports.EmiterCollection = EmiterCollection;
