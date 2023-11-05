"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const SimpleEma_1 = require("./Strategies/SimpleEma");
class Strategy {
    constructor(strategy) {
        this.strategy = strategy;
    }
    loadStrategy(stopLoss, events, id, pubkey) {
        const strategy = {
            'simpleema': () => new SimpleEma_1.SimpleEmaStrategy(stopLoss, events, id, pubkey)
        };
        return strategy[this.strategy]();
    }
}
exports.Strategy = Strategy;
