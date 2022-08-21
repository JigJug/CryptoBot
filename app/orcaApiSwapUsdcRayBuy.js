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
exports.orcaApiSwapBuy = void 0;
var fs = require('fs');
var web3_js_1 = require("@solana/web3.js");
var sdk_1 = require("@orca-so/sdk");
var decimal_js_1 = __importDefault(require("decimal.js"));
function orcaApiSwapBuy(path, ammount) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var main = function () { return __awaiter(_this, void 0, void 0, function () {
            var secretKeyString, secretKey, owner, connection, orca, rayUsdcPool, usdcToken, usdcAmount, quote, rayAmount, swapPayload, swapTxId, returnNum, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        secretKeyString = fs.readFileSync(path, "utf8", function (err, data) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                        secretKeyString = JSON.parse(secretKeyString);
                        secretKey = Uint8Array.from(secretKeyString.pk);
                        owner = web3_js_1.Keypair.fromSecretKey(secretKey);
                        connection = new web3_js_1.Connection("https://api.mainnet-beta.solana.com", "singleGossip");
                        orca = sdk_1.getOrca(connection);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        rayUsdcPool = orca.getPool(sdk_1.OrcaPoolConfig.RAY_USDC);
                        usdcToken = rayUsdcPool.getTokenB();
                        usdcAmount = new decimal_js_1.default(ammount);
                        return [4 /*yield*/, rayUsdcPool.getQuote(usdcToken, usdcAmount)];
                    case 2:
                        quote = _a.sent();
                        rayAmount = quote.getMinOutputAmount();
                        console.log("Swap " + usdcAmount.toString() + " usdc for at least " + rayAmount.toNumber() + " ray");
                        return [4 /*yield*/, rayUsdcPool.swap(owner, usdcToken, usdcAmount, rayAmount)];
                    case 3:
                        swapPayload = _a.sent();
                        return [4 /*yield*/, swapPayload.execute()];
                    case 4:
                        swapTxId = _a.sent();
                        console.log("Swapped:", swapTxId, "\n");
                        returnNum = Math.trunc(rayAmount.toNumber());
                        resolve(returnNum);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.warn(err_1);
                        reject(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        main()
            .then(function () {
            console.log("Done");
        })
            .catch(function (e) {
            console.error(e);
            reject();
        });
    });
}
exports.orcaApiSwapBuy = orcaApiSwapBuy;
