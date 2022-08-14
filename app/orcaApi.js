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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var web3_js_1 = require("@solana/web3.js");
var sdk_1 = require("@orca-so/sdk");
var decimal_js_1 = __importDefault(require("decimal.js"));
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var secretKeyString, secretKey, owner, connection, orca, orcaSolPool, solToken, solAmount, quote, orcaAmount, swapPayload, swapTxId, _a, maxTokenAIn, maxTokenBIn, minPoolTokenAmountOut, poolDepositPayload, poolDepositTxId, lpBalance, orcaSolFarm, farmDepositPayload, farmDepositTxId, farmBalance, farmWithdrawPayload, farmWithdrawTxId, withdrawTokenAmount, withdrawTokenMint, _b, maxPoolTokenAmountIn, minTokenAOut, minTokenBOut, poolWithdrawPayload, poolWithdrawTxId, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, fs.readFile("/Users/scuba/my-wallet/my-keypair.json", "utf8")];
            case 1:
                secretKeyString = _c.sent();
                secretKey = Uint8Array.from(JSON.parse(secretKeyString));
                owner = web3_js_1.Keypair.fromSecretKey(secretKey);
                connection = new web3_js_1.Connection("https://api.mainnet-beta.solana.com", "singleGossip");
                orca = sdk_1.getOrca(connection);
                _c.label = 2;
            case 2:
                _c.trys.push([2, 19, , 20]);
                orcaSolPool = orca.getPool(sdk_1.OrcaPoolConfig.ORCA_SOL);
                solToken = orcaSolPool.getTokenB();
                solAmount = new decimal_js_1.default(0.1);
                return [4 /*yield*/, orcaSolPool.getQuote(solToken, solAmount)];
            case 3:
                quote = _c.sent();
                orcaAmount = quote.getMinOutputAmount();
                console.log("Swap " + solAmount.toString() + " SOL for at least " + orcaAmount.toNumber() + " ORCA");
                return [4 /*yield*/, orcaSolPool.swap(owner, solToken, solAmount, orcaAmount)];
            case 4:
                swapPayload = _c.sent();
                return [4 /*yield*/, swapPayload.execute()];
            case 5:
                swapTxId = _c.sent();
                console.log("Swapped:", swapTxId, "\n");
                return [4 /*yield*/, orcaSolPool.getDepositQuote(orcaAmount, solAmount)];
            case 6:
                _a = _c.sent(), maxTokenAIn = _a.maxTokenAIn, maxTokenBIn = _a.maxTokenBIn, minPoolTokenAmountOut = _a.minPoolTokenAmountOut;
                console.log("Deposit at most " + maxTokenBIn.toNumber() + " SOL and " + maxTokenAIn.toNumber() + " ORCA, for at least " + minPoolTokenAmountOut.toNumber() + " LP tokens");
                return [4 /*yield*/, orcaSolPool.deposit(owner, maxTokenAIn, maxTokenBIn, minPoolTokenAmountOut)];
            case 7:
                poolDepositPayload = _c.sent();
                return [4 /*yield*/, poolDepositPayload.execute()];
            case 8:
                poolDepositTxId = _c.sent();
                console.log("Pool deposited:", poolDepositTxId, "\n");
                return [4 /*yield*/, orcaSolPool.getLPBalance(owner.publicKey)];
            case 9:
                lpBalance = _c.sent();
                orcaSolFarm = orca.getFarm(sdk_1.OrcaFarmConfig.ORCA_SOL_AQ);
                return [4 /*yield*/, orcaSolFarm.deposit(owner, lpBalance)];
            case 10:
                farmDepositPayload = _c.sent();
                return [4 /*yield*/, farmDepositPayload.execute()];
            case 11:
                farmDepositTxId = _c.sent();
                console.log("Farm deposited:", farmDepositTxId, "\n");
                return [4 /*yield*/, orcaSolFarm.getFarmBalance(owner.publicKey)];
            case 12:
                farmBalance = _c.sent();
                return [4 /*yield*/, orcaSolFarm.withdraw(owner, farmBalance)];
            case 13:
                farmWithdrawPayload = _c.sent();
                return [4 /*yield*/, farmWithdrawPayload.execute()];
            case 14:
                farmWithdrawTxId = _c.sent();
                console.log("Farm withdrawn:", farmWithdrawTxId, "\n");
                return [4 /*yield*/, orcaSolPool.getLPBalance(owner.publicKey)];
            case 15:
                withdrawTokenAmount = _c.sent();
                withdrawTokenMint = orcaSolPool.getPoolTokenMint();
                return [4 /*yield*/, orcaSolPool.getWithdrawQuote(withdrawTokenAmount, withdrawTokenMint)];
            case 16:
                _b = _c.sent(), maxPoolTokenAmountIn = _b.maxPoolTokenAmountIn, minTokenAOut = _b.minTokenAOut, minTokenBOut = _b.minTokenBOut;
                console.log("Withdraw at most " + maxPoolTokenAmountIn.toNumber() + " ORCA_SOL LP token for at least " + minTokenAOut.toNumber() + " ORCA and " + minTokenBOut.toNumber() + " SOL");
                return [4 /*yield*/, orcaSolPool.withdraw(owner, maxPoolTokenAmountIn, minTokenAOut, minTokenBOut)];
            case 17:
                poolWithdrawPayload = _c.sent();
                return [4 /*yield*/, poolWithdrawPayload.execute()];
            case 18:
                poolWithdrawTxId = _c.sent();
                console.log("Pool withdrawn:", poolWithdrawTxId, "\n");
                return [3 /*break*/, 20];
            case 19:
                err_1 = _c.sent();
                console.warn(err_1);
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); };
main()
    .then(function () {
    console.log("Done");
})
    .catch(function (e) {
    console.error(e);
});
