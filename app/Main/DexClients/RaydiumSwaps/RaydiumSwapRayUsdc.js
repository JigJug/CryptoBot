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
const web3_js_1 = require("@solana/web3.js");
const util_mainnet_1 = require("./util_mainnet");
const util_1 = require("./util");
// @ts-ignore
const bs58_1 = __importDefault(require("bs58"));
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("https://solana-api.projectserum.com", "confirmed");
    // change to your privateKey
    const secretKey = bs58_1.default.decode('3qswEeCJcA9ogpN3JEuXBtmnU35YPzSxBwzrk6sdTPhogMJ64WuabU9XWg2yUegJvv1qupYPqo2jQrrK26N7HGsD');
    const ownerKeypair = web3_js_1.Keypair.fromSecretKey(secretKey);
    const owner = ownerKeypair.publicKey;
    console.log(owner.toString());
    const tokenAccounts = yield (0, util_1.getTokenAccountsByOwner)(connection, owner);
    // SOL-USDC
    const POOL_ID = "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2";
    const info = yield (0, util_1.getLiquidityInfo)(connection, new web3_js_1.PublicKey(POOL_ID), raydium_sdk_1.SERUM_PROGRAM_ID_V3);
    // @ts-ignore
    console.log("base Vault:", info.baseVaultKey.toBase58(), info.baseVaultBalance);
    // @ts-ignore
    console.log("quote Vault:", info.quoteVaultKey.toBase58(), info.quoteVaultBalance);
    // @ts-ignore
    console.log(`openOrders Account ${info.openOrdersKey.toBase58()}, base Serum book total: ${info.openOrdersTotalBase},quote Serum book total: ${info.openOrdersTotalQuote} `);
    // @ts-ignore
    console.log(`base pnl: ${info.basePnl}, quote pnl: ${info.quotePnl}`);
    // @ts-ignore
    console.log(`Final base:${info.base}, quote:${info.quote}, priceInQuote: ${info.priceInQuote}, lpSupply:${info.lpSupply}`);
    // const allPoolKeys = await fetchAllPoolKeys(connection);
    // const poolKeys = allPoolKeys.find((item) => item.id.toBase58() === RAY_USDC)
    const poolKeys = yield (0, util_mainnet_1.fetchPoolKeys)(connection, new web3_js_1.PublicKey(POOL_ID));
    yield (0, util_1.swap)(connection, poolKeys, ownerKeypair, tokenAccounts);
    //await addLiquidity(connection, poolKeys, ownerKeypair, tokenAccounts)
    //await removeLiquidity(connection, poolKeys, ownerKeypair, tokenAccounts)
    const FIDA_RAY = "2dRNngAm729NzLbb1pzgHtfHvPqR4XHFmFyYK78EfEeX";
    const RAY_USDC = "6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg";
    const fromPoolKeys = yield (0, util_mainnet_1.fetchPoolKeys)(connection, new web3_js_1.PublicKey(FIDA_RAY));
    const toPoolKeys = yield (0, util_mainnet_1.fetchPoolKeys)(connection, new web3_js_1.PublicKey(RAY_USDC));
    const FIDA_MINT_ID = fromPoolKeys.baseMint;
    const USDC_MINT_ID = poolKeys.quoteMint;
    const relatedPoolKeys = yield (0, util_mainnet_1.getRouteRelated)(connection, FIDA_MINT_ID, USDC_MINT_ID);
    yield (0, util_1.routeSwap)(connection, fromPoolKeys, toPoolKeys, ownerKeypair, tokenAccounts);
    yield (0, util_1.tradeSwap)(connection, FIDA_MINT_ID, USDC_MINT_ID, relatedPoolKeys, ownerKeypair, tokenAccounts);
}))();
