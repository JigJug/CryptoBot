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
exports.getBalance = void 0;
const web3_js_1 = require("@solana/web3.js");
function chekckWalletBalance(usdc) {
    return new Promise((resolve, reject) => {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"), "confirmed");
        let pubKey = '8Vp83HeSX1YavzXhSsKyrZpRzjwJAbPxd6zyLp5YuTBF';
        let wallet = new web3_js_1.PublicKey(pubKey);
        let usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        let mintWalletUsdc = new web3_js_1.PublicKey(usdcMint);
        let orcaMint = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE';
        let mintWalletOrca = new web3_js_1.PublicKey(orcaMint);
        const main = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                //sol
                //const balance = await connection.getBalance(wallet);
                //console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
                //usdc
                const balanceUsdc = yield connection.getParsedTokenAccountsByOwner(wallet, { mint: mintWalletUsdc });
                const balanceUsdcParsed = (_a = balanceUsdc.value[0]) === null || _a === void 0 ? void 0 : _a.account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`uscd balance: ${balanceUsdcParsed}`);
                let inBalUsdc = parseInt(balanceUsdcParsed);
                //orca
                const balanceOrca = yield connection.getParsedTokenAccountsByOwner(wallet, { mint: mintWalletOrca });
                const balanceOrcaParsed = (_b = balanceOrca.value[0]) === null || _b === void 0 ? void 0 : _b.account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`orca balance: ${balanceOrcaParsed}`);
                let inBalOrca = parseInt(balanceOrcaParsed);
                if (usdc) {
                    resolve(inBalUsdc);
                }
                else {
                    resolve(inBalOrca);
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
        main()
            .then(() => {
            console.log('done');
        })
            .catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
function getBalance(uscdc) {
    return chekckWalletBalance(uscdc);
}
exports.getBalance = getBalance;
