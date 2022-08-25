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
exports.fetchAllPoolKeys = exports.getRouteRelated = exports.fetchPoolKeys = void 0;
const web3_js_1 = require("@solana/web3.js");
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
function fetchPoolKeys(connection, poolId, version = 4) {
    return __awaiter(this, void 0, void 0, function* () {
        // const version = 4
        const serumVersion = 3;
        const marketVersion = 3;
        const programId = raydium_sdk_1.LIQUIDITY_PROGRAM_ID_V4;
        const serumProgramId = raydium_sdk_1.SERUM_PROGRAM_ID_V3;
        const account = yield connection.getAccountInfo(poolId);
        const { state: LiquidityStateLayout } = raydium_sdk_1.Liquidity.getLayouts(version);
        //@ts-ignore
        const fields = LiquidityStateLayout.decode(account.data);
        const { status, baseMint, quoteMint, lpMint, openOrders, targetOrders, baseVault, quoteVault, marketId } = fields;
        let withdrawQueue, lpVault;
        if (raydium_sdk_1.Liquidity.isV4(fields)) {
            withdrawQueue = fields.withdrawQueue;
            lpVault = fields.lpVault;
        }
        else {
            withdrawQueue = web3_js_1.PublicKey.default;
            lpVault = web3_js_1.PublicKey.default;
        }
        // uninitialized
        // if (status.isZero()) {
        //   return ;
        // }
        const associatedPoolKeys = yield raydium_sdk_1.Liquidity.getAssociatedPoolKeys({
            version,
            baseMint,
            quoteMint,
            marketId,
        });
        const poolKeys = {
            id: poolId,
            baseMint,
            quoteMint,
            lpMint,
            version,
            programId,
            authority: associatedPoolKeys.authority,
            openOrders,
            targetOrders,
            baseVault,
            quoteVault,
            withdrawQueue,
            lpVault,
            marketVersion: serumVersion,
            marketProgramId: serumProgramId,
            marketId,
            marketAuthority: associatedPoolKeys.marketAuthority,
        };
        const marketInfo = yield connection.getAccountInfo(marketId);
        const { state: MARKET_STATE_LAYOUT } = raydium_sdk_1.Market.getLayouts(marketVersion);
        //@ts-ignore
        const market = MARKET_STATE_LAYOUT.decode(marketInfo.data);
        const { baseVault: marketBaseVault, quoteVault: marketQuoteVault, bids: marketBids, asks: marketAsks, eventQueue: marketEventQueue, } = market;
        // const poolKeys: LiquidityPoolKeys;
        return Object.assign(Object.assign({}, poolKeys), {
            marketBaseVault,
            marketQuoteVault,
            marketBids,
            marketAsks,
            marketEventQueue,
        });
    });
}
exports.fetchPoolKeys = fetchPoolKeys;
function getRouteRelated(connection, tokenInMint, tokenOutMint) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tokenInMint || !tokenOutMint)
            return [];
        const tokenInMintString = tokenInMint.toBase58();
        const tokenOutMintString = tokenOutMint.toBase58();
        const allPoolKeys = yield fetchAllPoolKeys();
        const routeMiddleMints = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', 'So11111111111111111111111111111111111111112', 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', 'Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS', '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', 'USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'];
        const candidateTokenMints = routeMiddleMints.concat([tokenInMintString, tokenOutMintString]);
        const onlyRouteMints = routeMiddleMints.filter((routeMint) => ![tokenInMintString, tokenOutMintString].includes(routeMint));
        const routeRelated = allPoolKeys.filter((info) => {
            const isCandidate = candidateTokenMints.includes(info.baseMint.toBase58()) && candidateTokenMints.includes(info.quoteMint.toBase58());
            const onlyInRoute = onlyRouteMints.includes(info.baseMint.toBase58()) && onlyRouteMints.includes(info.quoteMint.toBase58());
            return isCandidate && !onlyInRoute;
        });
        return routeRelated;
    });
}
exports.getRouteRelated = getRouteRelated;
// export const fetchAllPoolKeys = Liquidity.fetchAllPoolKeys
const importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = (...args) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield importDynamic('node-fetch');
    return module.default(...args);
});
function fetchAllPoolKeys() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://api.raydium.io/v2/sdk/liquidity/mainnet.json');
        if (!(yield response).ok)
            return [];
        const json = yield response.json();
        const poolsKeysJson = [...((_a = json === null || json === void 0 ? void 0 : json.official) !== null && _a !== void 0 ? _a : []), ...((_b = json === null || json === void 0 ? void 0 : json.unOfficial) !== null && _b !== void 0 ? _b : [])];
        const poolsKeys = poolsKeysJson.map((item) => {
            const { id, baseMint, quoteMint, lpMint, baseDecimals, quoteDecimals, lpDecimals, version, programId, authority, openOrders, targetOrders, baseVault, quoteVault, withdrawQueue, lpVault, marketVersion, marketProgramId, marketId, marketAuthority, marketBaseVault, marketQuoteVault, marketBids, marketAsks, marketEventQueue, } = (0, raydium_sdk_1.jsonInfo2PoolKeys)(item);
            return {
                id,
                baseMint,
                quoteMint,
                lpMint,
                baseDecimals,
                quoteDecimals,
                lpDecimals,
                version,
                programId,
                authority,
                openOrders,
                targetOrders,
                baseVault,
                quoteVault,
                withdrawQueue,
                lpVault,
                marketVersion,
                marketProgramId,
                marketId,
                marketAuthority,
                marketBaseVault,
                marketQuoteVault,
                marketBids,
                marketAsks,
                marketEventQueue,
            };
        });
        return poolsKeys;
    });
}
exports.fetchAllPoolKeys = fetchAllPoolKeys;
