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
exports.raydiumApiSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const util_mainnet_1 = require("./util_mainnet");
const util_1 = require("./util");
const RaydiumPools_1 = require("./RaydiumPools");
function raydiumApiSwap(ammount, side, secretKey, pairing) {
    return new Promise((resolve, reject) => {
        const swap = () => __awaiter(this, void 0, void 0, function* () {
            let raydiumPairing = pairing.replace('/', '_');
            const fromRaydiumPools = RaydiumPools_1.RaydiumPools[raydiumPairing];
            console.log(`fetched pool key ${raydiumPairing}: ${fromRaydiumPools}`);
            const connection = new web3_js_1.Connection("https://solana-api.projectserum.com", "confirmed");
            const skBuffer = Buffer.from(secretKey);
            const ownerKeypair = web3_js_1.Keypair.fromSecretKey(skBuffer);
            const owner = ownerKeypair.publicKey;
            try {
                const tokenAccounts = yield (0, util_1.getTokenAccountsByOwner)(connection, owner);
                console.log('connected token account');
                const poolKeys = yield (0, util_mainnet_1.fetchPoolKeys)(connection, new web3_js_1.PublicKey(fromRaydiumPools));
                console.log(`fetched pool keys: ${poolKeys}`);
                console.log(poolKeys.marketBids);
                if (poolKeys) {
                    const poolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys });
                    ammount = ammount * 1000000;
                    let coinIn;
                    let coinOut;
                    if (side == 'buy') {
                        coinIn = poolKeys.quoteMint;
                        coinOut = poolKeys.baseMint;
                    }
                    else {
                        coinIn = poolKeys.baseMint;
                        coinOut = poolKeys.quoteMint;
                    }
                    const amountIn = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(coinIn, 6), ammount);
                    const currencyOut = new raydium_sdk_1.Token(coinOut, 6);
                    const slippage = new raydium_sdk_1.Percent(5, 100);
                    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = raydium_sdk_1.Liquidity.computeAmountOut({
                        poolKeys,
                        poolInfo,
                        amountIn,
                        currencyOut,
                        slippage
                    });
                    const excPr = () => {
                        if (executionPrice != null) {
                            return executionPrice.toFixed();
                        }
                    };
                    console.log(amountOut.toFixed(), minAmountOut.toFixed(), currentPrice.toFixed(), excPr(), priceImpact.toFixed(), fee.toFixed());
                    const { transaction, signers } = yield raydium_sdk_1.Liquidity.makeSwapTransaction({
                        connection,
                        poolKeys,
                        userKeys: {
                            tokenAccounts,
                            owner,
                        },
                        amountIn,
                        amountOut: minAmountOut,
                        fixedSide: "in"
                    });
                    const signature = yield connection.sendTransaction(transaction, [...signers, ownerKeypair], { skipPreflight: true });
                    console.log(signature);
                    //check transaction
                    let timeNow = new Date().getTime();
                    function checkTransactionError(timeNow, signature) {
                        let newtime = new Date().getTime();
                        let tdiff = newtime - timeNow;
                        if (tdiff > 30000) {
                            return reject(new Error('Transaction not processed'));
                        }
                        const checkConfirmation = () => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b;
                            const status = yield connection.getSignatureStatus(signature);
                            if (((_a = status.value) === null || _a === void 0 ? void 0 : _a.confirmationStatus) == 'confirmed') {
                                if ((_b = status.value) === null || _b === void 0 ? void 0 : _b.err) {
                                    console.log('error');
                                    return reject(new Error('Transaction Failed'));
                                }
                                else {
                                    return resolve();
                                }
                            }
                            checkTransactionError(timeNow, signature);
                        });
                        return checkConfirmation();
                    }
                    checkTransactionError(timeNow, signature);
                }
            }
            catch (err) {
                reject(err);
            }
        });
        swap();
    });
}
exports.raydiumApiSwap = raydiumApiSwap;
