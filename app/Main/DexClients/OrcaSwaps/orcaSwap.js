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
exports.orcaApiSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("@orca-so/sdk");
const decimal_js_1 = __importDefault(require("decimal.js"));
function orcaApiSwap(ammount, side, secretKey, pairing) {
    return new Promise((resolve, reject) => {
        const swap = () => __awaiter(this, void 0, void 0, function* () {
            console.log('swapping through orca dex');
            //Get the orca pool from pairing
            let orcaPairing1 = pairing.replace('/', '_');
            let orcaPairing = orcaPairing1.replace('T', 'C');
            const fromOrcaPoolConfig = sdk_1.OrcaPoolConfig[`${orcaPairing}`];
            //Read secret key file to get owner keypair
            const unit8Sk = Uint8Array.from(secretKey);
            const owner = web3_js_1.Keypair.fromSecretKey(unit8Sk);
            //Initialzie Orca object with mainnet connection
            const connection = new web3_js_1.Connection("https://api.mainnet-beta.solana.com", "singleGossip");
            const orca = (0, sdk_1.getOrca)(connection);
            try {
                const orcaPool = orca.getPool(fromOrcaPoolConfig); // get the liquidity pool key
                const orcaToken = (side) => {
                    if (side == 'sell')
                        return orcaPool.getTokenA(); //token A from first token
                    else
                        return orcaPool.getTokenB(); //token B from second token
                };
                const orcaAmount = new decimal_js_1.default(ammount);
                const slippage = new decimal_js_1.default(0.05);
                const quote = yield orcaPool.getQuote(orcaToken(side), orcaAmount, slippage);
                const usdcAmount = quote.getMinOutputAmount();
                console.log(`Swap ${orcaAmount.toString()} ${orcaPool.getTokenA().name} for at least ${usdcAmount.toNumber()} usdc (${side})`);
                const swapPayload = yield orcaPool.swap(owner, orcaToken(side), orcaAmount, usdcAmount);
                const swapTxId = yield swapPayload.execute();
                console.log("Swapped:", swapTxId, "\n");
                resolve();
            }
            catch (err) {
                console.warn(err);
                reject(err);
            }
        });
        swap();
    });
}
exports.orcaApiSwap = orcaApiSwap;
