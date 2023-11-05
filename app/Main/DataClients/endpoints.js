"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = void 0;
function binanceEndpoints(config) {
    const baseUrl = 'https://api.binance.com/api/v3/';
    return {
        candleData: `${baseUrl}klines?symbol=${config.pairing.replace('/', '')}&interval=${config.windowResolution}`,
        price: `${baseUrl}ticker/price?symbol=${config.pairing.replace('/', '')}`
    };
}
function endpoints(config) {
    const getBaseUrl = {
        binance: () => binanceEndpoints(config)
    };
    return getBaseUrl[config.cexData]();
}
exports.endpoints = endpoints;
