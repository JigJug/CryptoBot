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
exports.orcaApiSwapSell = void 0;
const fs = require('fs');
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("@orca-so/sdk");
const decimal_js_1 = __importDefault(require("decimal.js"));
function orcaApiSwapSell(path, ammount) {
    return new Promise((resolve, reject) => {
        const main = () => __awaiter(this, void 0, void 0, function* () {
            /*** Setup ***/
            // 1. Read secret key file to get owner keypair2
            //path = secret key filepath
            let secretKeyString = fs.readFileSync(path, "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            secretKeyString = JSON.parse(secretKeyString);
            const secretKey = Uint8Array.from(secretKeyString.pk);
            const owner = web3_js_1.Keypair.fromSecretKey(secretKey);
            // 2. Initialzie Orca object with mainnet connection
            const connection = new web3_js_1.Connection("https://api.mainnet-beta.solana.com", "singleGossip");
            const orca = sdk_1.getOrca(connection);
            try {
                /*** Swap ***/
                // 3. We will be swapping 0.1 SOL for some ORCA
                const rayUsdcPool = orca.getPool(sdk_1.OrcaPoolConfig.RAY_SOL); // get the liquidity pool
                const rayToken = rayUsdcPool.getTokenA(); //or getTokenB(); // get the token a or b from pool name
                const rayAmount = new decimal_js_1.default(ammount);
                const slippage = new decimal_js_1.default(0.05);
                const quote = yield rayUsdcPool.getQuote(rayToken, rayAmount, slippage);
                const usdcAmount = quote.getMinOutputAmount();
                console.log(`Swap ${rayAmount.toString()} ray for at least ${usdcAmount.toNumber()} usdc`);
                const swapPayload = yield rayUsdcPool.swap(owner, rayToken, rayAmount, usdcAmount);
                const swapTxId = yield swapPayload.execute();
                console.log("Swapped:", swapTxId, "\n");
                let returnNum = Math.trunc(usdcAmount.toNumber());
                resolve(returnNum);
            }
            catch (err) {
                console.warn(err);
                reject(err);
            }
        });
        main()
            .then(() => {
            console.log("finished orca transaction");
            //resolve()
        })
            .catch((e) => {
            console.error(e);
            reject();
        });
    });
}
exports.orcaApiSwapSell = orcaApiSwapSell;
