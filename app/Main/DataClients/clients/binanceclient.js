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
exports.BinanceClient = void 0;
const baseclient_1 = require("../baseclient");
const calcema_1 = __importDefault(require("./calcema"));
class BinanceClient extends baseclient_1.BaseClient {
    constructor(endpoints) {
        super(endpoints);
    }
    processHistoricData(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const mapBinanceCandleData = (data) => {
                console.log('mapping data');
                return data.map((v) => {
                    return {
                        startTime: v[0],
                        time: v[6],
                        open: parseFloat(v[1]),
                        high: parseFloat(v[2]),
                        low: parseFloat(v[3]),
                        close: parseFloat(v[4]),
                        volume: parseFloat(v[5]),
                    };
                });
            };
            try {
                const historicCandleData = yield this.candleData();
                console.log(this.endpoints.candleData);
                const data = mapBinanceCandleData(JSON.parse(historicCandleData));
                const dataWithEma = yield (0, calcema_1.default)(data, parseInt(config.emaInterval), config.pairing, '300');
                const md = dataWithEma.reverse();
                return md[1];
            }
            catch (err) {
                throw err;
            }
        });
    }
    processPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const priceRet = yield this.price();
                return parseFloat(JSON.parse(priceRet).price);
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.BinanceClient = BinanceClient;
