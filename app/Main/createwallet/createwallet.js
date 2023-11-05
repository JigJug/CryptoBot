"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
function createWallet() {
    return web3_js_1.Keypair.generate();
}
exports.createWallet = createWallet;
