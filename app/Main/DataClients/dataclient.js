"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.DataClient = void 0;
const endpoints_1 = require("./endpoints");
const binanceclient_1 = require("./clients/binanceclient");
class GetDataClient {
    getDch(config) {
        const eps = (0, endpoints_1.endpoints)(config);
        const cdh = {
            binance: () => new binanceclient_1.BinanceClient(eps),
        };
        return cdh[config.cexData]();
    }
}
class DataClient {
    constructor(dataHandler, config) {
        this.dataHandler = dataHandler;
        this.config = config;
    }
    historicMarketData() {
        return this.dataHandler.processHistoricData(this.config);
    }
    getPrice() {
        return this.dataHandler.processPrice();
    }
}
exports.DataClient = DataClient;
class Client {
    getClient(config) {
        return new DataClient(new GetDataClient().getDch(config), config);
    }
}
exports.Client = Client;
