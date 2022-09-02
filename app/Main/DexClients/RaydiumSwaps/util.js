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
exports.getLiquidityInfo = exports.tradeSwap = exports.routeSwap = exports.removeLiquidity = exports.addLiquidity = exports.swap = exports.closeWsol = exports.createWsol = exports.getTokenAccountsByOwner = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const serum_1 = require("@project-serum/serum");
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
function getTokenAccountsByOwner(connection, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenResp = yield connection.getTokenAccountsByOwner(owner, {
            programId: raydium_sdk_1.TOKEN_PROGRAM_ID
        });
        const accounts = [];
        for (const { pubkey, account } of tokenResp.value) {
            accounts.push({
                pubkey,
                accountInfo: raydium_sdk_1.SPL_ACCOUNT_LAYOUT.decode(account.data)
            });
        }
        return accounts;
    });
}
exports.getTokenAccountsByOwner = getTokenAccountsByOwner;
const WSOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
function createWsol(connection, ownerKeypair, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const newAccount = web3_js_1.Keypair.generate();
        const newAccountPubkey = newAccount.publicKey;
        const owner = ownerKeypair.publicKey;
        const lamports = yield connection.getMinimumBalanceForRentExemption(raydium_sdk_1.SPL_ACCOUNT_LAYOUT.span);
        console.log('lamports: ', lamports, raydium_sdk_1.SPL_ACCOUNT_LAYOUT.span);
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
            fromPubkey: owner,
            newAccountPubkey,
            lamports: lamports,
            space: raydium_sdk_1.SPL_ACCOUNT_LAYOUT.span,
            programId: raydium_sdk_1.TOKEN_PROGRAM_ID
        }), web3_js_1.SystemProgram.transfer({
            fromPubkey: owner,
            toPubkey: newAccountPubkey,
            lamports: amount * Math.pow(10, 9),
        }), spl_token_1.Token.createInitAccountInstruction(raydium_sdk_1.TOKEN_PROGRAM_ID, WSOL_MINT, newAccountPubkey, owner));
        yield sendTx(connection, transaction, [ownerKeypair, newAccount]);
    });
}
exports.createWsol = createWsol;
function closeWsol(connection, ownerKeypair, wsolAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const owner = ownerKeypair.publicKey;
        const transaction = new web3_js_1.Transaction().add(spl_token_1.Token.createCloseAccountInstruction(raydium_sdk_1.TOKEN_PROGRAM_ID, wsolAddress, owner, owner, []));
        yield sendTx(connection, transaction, [ownerKeypair,]);
    });
}
exports.closeWsol = closeWsol;
function sendTx(connection, transaction, signers) {
    return __awaiter(this, void 0, void 0, function* () {
        let txRetry = 0;
        console.log('signers len:', signers.length);
        console.log('transaction instructions len:', transaction.instructions.length);
        transaction.instructions.forEach(ins => {
            console.log(ins.programId.toBase58());
            ins.keys.forEach(m => {
                console.log('\t', m.pubkey.toBase58(), m.isSigner, m.isWritable);
            });
            console.log('\t datasize:', ins.data.length);
        });
        transaction.recentBlockhash = (yield connection.getLatestBlockhash('processed')).blockhash;
        transaction.sign(...signers);
        const rawTransaction = transaction.serialize();
        console.log('packsize :', rawTransaction.length);
        while (++txRetry <= 3) {
            const txid = yield connection.sendRawTransaction(rawTransaction, {
                skipPreflight: false,
                preflightCommitment: 'confirmed'
            });
            let url = `${txRetry}, https://solscan.io/tx/${txid}`;
            if (connection.rpcEndpoint.includes('dev'))
                url += '?cluster=devnet';
            console.log(url);
            yield new Promise(resolve => setTimeout(resolve, 1000 * 6));
            const ret = yield connection.getSignatureStatus(txid, { searchTransactionHistory: true });
            try {
                //@ts-ignore
                if (ret.value && ret.value.err == null) {
                    console.log(txRetry, 'success');
                    break;
                }
                else {
                    console.log(txRetry, 'failed', ret);
                }
            }
            catch (e) {
                console.log(txRetry, 'failed', ret);
            }
        }
    });
}
function swap(connection, poolKeys, ownerKeypair, tokenAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('swap start');
        const owner = ownerKeypair.publicKey;
        const poolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys });
        // real amount = 1000000 / 10**poolInfo.baseDecimals
        const amountIn = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(poolKeys.baseMint, poolInfo.baseDecimals), 0.1, false);
        const currencyOut = new raydium_sdk_1.Token(poolKeys.quoteMint, poolInfo.quoteDecimals);
        // 5% slippage
        const slippage = new raydium_sdk_1.Percent(5, 100);
        const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee, } = raydium_sdk_1.Liquidity.computeAmountOut({ poolKeys, poolInfo, amountIn, currencyOut, slippage, });
        // @ts-ignore
        // console.log(amountOut.toFixed(), minAmountOut.toFixed(), currentPrice.toFixed(), executionPrice.toFixed(), priceImpact.toFixed(), fee.toFixed())
        console.log(`swap: ${poolKeys.id.toBase58()}, amountIn: ${amountIn.toFixed()}, amountOut: ${amountOut.toFixed()}, executionPrice: ${executionPrice.toFixed()}`);
        // const minAmountOut = new TokenAmount(new Token(poolKeys.quoteMint, poolInfo.quoteDecimals), 1000000)
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
        yield sendTx(connection, transaction, [ownerKeypair, ...signers]);
        console.log('swap end');
    });
}
exports.swap = swap;
function addLiquidity(connection, poolKeys, ownerKeypair, tokenAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('addLiquidity start');
        const owner = ownerKeypair.publicKey;
        const poolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys });
        // real amount = 1000000 / 10**poolInfo.baseDecimals
        const amount = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(poolKeys.baseMint, poolInfo.baseDecimals), 0.1, false);
        const anotherCurrency = new raydium_sdk_1.Currency(poolInfo.quoteDecimals);
        // 5% slippage
        const slippage = new raydium_sdk_1.Percent(5, 100);
        const { anotherAmount, maxAnotherAmount } = raydium_sdk_1.Liquidity.computeAnotherAmount({ poolKeys, poolInfo, amount, anotherCurrency, slippage, });
        console.log(`addLiquidity: ${poolKeys.id.toBase58()}, base amount: ${amount.toFixed()}, quote amount: ${anotherAmount.toFixed()}`);
        const amountInB = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(poolKeys.quoteMint, poolInfo.quoteDecimals), maxAnotherAmount.toFixed(), false);
        const { transaction, signers } = yield raydium_sdk_1.Liquidity.makeAddLiquidityTransaction({
            connection,
            poolKeys,
            userKeys: {
                tokenAccounts,
                owner,
            },
            amountInA: amount,
            amountInB,
            fixedSide: 'a'
        });
        yield sendTx(connection, transaction, [ownerKeypair, ...signers]);
        console.log('addLiquidity end');
    });
}
exports.addLiquidity = addLiquidity;
function removeLiquidity(connection, poolKeys, ownerKeypair, tokenAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('removeLiquidity start');
        const owner = ownerKeypair.publicKey;
        const poolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys });
        const lpToken = tokenAccounts.find((t) => t.accountInfo.mint.toBase58() === poolKeys.lpMint.toBase58());
        if (lpToken) {
            const ratio = parseFloat(lpToken.accountInfo.amount.toString()) / parseFloat(poolInfo.lpSupply.toString());
            console.log(`base amount: ${poolInfo.baseReserve.toNumber() * ratio / Math.pow(10, poolInfo.baseDecimals)}, quote amount: ${poolInfo.quoteReserve.toNumber() * ratio / Math.pow(10, poolInfo.quoteDecimals)} `);
            const amountIn = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(poolKeys.lpMint, poolInfo.lpDecimals), lpToken.accountInfo.amount.toNumber());
            const { transaction, signers } = yield raydium_sdk_1.Liquidity.makeRemoveLiquidityTransaction({
                connection,
                poolKeys,
                userKeys: {
                    tokenAccounts,
                    owner,
                },
                amountIn,
            });
            yield sendTx(connection, transaction, [ownerKeypair, ...signers]);
        }
        console.log('removeLiquidity end');
    });
}
exports.removeLiquidity = removeLiquidity;
function routeSwap(connection, fromPoolKeys, toPoolKeys, ownerKeypair, tokenAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('route swap start');
        const owner = ownerKeypair.publicKey;
        const fromPoolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys: fromPoolKeys });
        const toPoolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys: toPoolKeys });
        const amountIn = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(fromPoolKeys.baseMint, fromPoolInfo.baseDecimals), 1, false);
        const currencyOut = new raydium_sdk_1.Token(toPoolKeys.quoteMint, toPoolInfo.quoteDecimals);
        // 5% slippage
        const slippage = new raydium_sdk_1.Percent(5, 100);
        const { amountOut, minAmountOut, executionPrice, priceImpact, fee } = raydium_sdk_1.Route.computeAmountOut({
            fromPoolKeys,
            toPoolKeys,
            fromPoolInfo,
            toPoolInfo,
            amountIn,
            currencyOut,
            slippage,
        });
        // @ts-ignore
        console.log(`route swap: ${fromPoolKeys.id.toBase58()}, amountIn: ${amountIn.toFixed()}, amountOut: ${amountOut.toFixed()}, executionPrice: ${executionPrice.toFixed()}`);
        const { setupTransaction, swapTransaction } = yield raydium_sdk_1.Route.makeSwapTransaction({
            connection,
            fromPoolKeys,
            toPoolKeys,
            userKeys: {
                tokenAccounts,
                owner,
            },
            amountIn,
            amountOut,
            fixedSide: "in",
        });
        if (setupTransaction) {
            yield sendTx(connection, setupTransaction.transaction, [ownerKeypair, ...setupTransaction.signers]);
        }
        if (swapTransaction) {
            yield sendTx(connection, swapTransaction.transaction, [ownerKeypair, ...swapTransaction.signers]);
        }
        console.log('route swap end');
    });
}
exports.routeSwap = routeSwap;
function tradeSwap(connection, tokenInMint, tokenOutMint, relatedPoolKeys, ownerKeypair, tokenAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('trade swap start');
        const owner = ownerKeypair.publicKey;
        const amountIn = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(tokenInMint, 6), 1, false);
        const currencyOut = new raydium_sdk_1.Token(tokenOutMint, 6);
        // 5% slippage
        const slippage = new raydium_sdk_1.Percent(5, 100);
        const pools = yield Promise.all(relatedPoolKeys.map((poolKeys) => __awaiter(this, void 0, void 0, function* () {
            const poolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys });
            return {
                poolKeys,
                poolInfo
            };
        })));
        const { amountOut, minAmountOut, executionPrice, currentPrice, priceImpact, routes, routeType, fee } = raydium_sdk_1.Trade.getBestAmountOut({
            pools,
            currencyOut,
            amountIn,
            slippage
        });
        console.log(`trade swap: amountIn: ${amountIn.toFixed()}, amountOut: ${amountOut.toFixed()}, executionPrice: ${executionPrice.toFixed()}, ${routeType}`);
        const { setupTransaction, tradeTransaction } = yield raydium_sdk_1.Trade.makeTradeTransaction({
            connection,
            routes,
            routeType,
            userKeys: {
                tokenAccounts,
                owner
            },
            amountIn,
            amountOut,
            fixedSide: 'in',
        });
        if (setupTransaction) {
            yield sendTx(connection, setupTransaction.transaction, [ownerKeypair, ...setupTransaction.signers]);
        }
        if (tradeTransaction) {
            yield sendTx(connection, tradeTransaction.transaction, [ownerKeypair, ...tradeTransaction.signers]);
        }
        console.log('trade swap end');
    });
}
exports.tradeSwap = tradeSwap;
// @ts-nocheck
function getLiquidityInfo(connection, poolId, dexProgramId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield connection.getAccountInfo(poolId);
        if (info === null)
            return null;
        const state = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);
        const baseTokenAmount = yield connection.getTokenAccountBalance(state.baseVault);
        const quoteTokenAmount = yield connection.getTokenAccountBalance(state.quoteVault);
        const openOrders = yield serum_1.OpenOrders.load(connection, state.openOrders, dexProgramId);
        const baseDecimal = Math.pow(10, state.baseDecimal.toNumber());
        const quoteDecimal = Math.pow(10, state.quoteDecimal.toNumber());
        const openOrdersTotalBase = openOrders.baseTokenTotal.toNumber() / baseDecimal;
        const openOrdersTotalQuote = openOrders.quoteTokenTotal.toNumber() / quoteDecimal;
        const basePnl = state.baseNeedTakePnl.toNumber() / baseDecimal;
        const quotePnl = state.quoteNeedTakePnl.toNumber() / quoteDecimal;
        // @ts-ignore
        const base = ((_a = baseTokenAmount.value) === null || _a === void 0 ? void 0 : _a.uiAmount) + openOrdersTotalBase - basePnl;
        // @ts-ignore
        const quote = ((_b = quoteTokenAmount.value) === null || _b === void 0 ? void 0 : _b.uiAmount) + openOrdersTotalQuote - quotePnl;
        const lpSupply = parseFloat(state.lpReserve.toString());
        const priceInQuote = quote / base;
        return {
            base,
            quote,
            lpSupply,
            baseVaultKey: state.baseVault,
            quoteVaultKey: state.quoteVault,
            baseVaultBalance: baseTokenAmount.value.uiAmount,
            quoteVaultBalance: quoteTokenAmount.value.uiAmount,
            openOrdersKey: state.openOrders,
            openOrdersTotalBase,
            openOrdersTotalQuote,
            basePnl,
            quotePnl,
            priceInQuote
        };
    });
}
exports.getLiquidityInfo = getLiquidityInfo;
