"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadExchange = void 0;
const orcaSwap_1 = require("./OrcaSwaps/orcaSwap");
class LoadExchange {
    constructor(exchange) {
        this.exchange = exchange;
    }
    swapClient() {
        if (this.exchange == 'orca') {
            return this.getOrca();
        }
        else {
            return (ammount, side, secretKey, pairing) => {
                return new Promise((resolve, reject) => {
                    reject(new Error('can not load exchange: check the bot configs'));
                });
            };
        }
    }
    getOrca() {
        return orcaSwap_1.orcaApiSwap;
    }
}
exports.LoadExchange = LoadExchange;
