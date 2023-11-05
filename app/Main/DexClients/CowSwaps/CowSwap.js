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
const cow_sdk_1 = require("@cowprotocol/cow-sdk");
const cow_sdk_2 = require("@cowprotocol/cow-sdk");
const providers_1 = require("@ethersproject/providers");
/**
 * to make an order we need to:
 * Get Market Price: Fee & Price
 * Sign the order: Using off-chain signing or Meta-transactions
 * Post the signed order to the API: So, the order becomes OPEN
 *
 * **MAKE SURE YOU HAVE ENABLED SELL TOKEN IN YOUR WALLET**
*/
function getMarketPrice() {
    return __awaiter(this, void 0, void 0, function* () {
        const orderBookApi = new cow_sdk_1.OrderBookApi({ chainId: cow_sdk_2.SupportedChainId.MAINNET });
        const quoteResponse = yield orderBookApi.getQuote({
            kind: cow_sdk_2.OrderKind.SELL,
            sellToken: '0xc778417e063141139fce010982780140aa0cd5ab',
            buyToken: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
            amount: '1000000000000000000',
            userAddress: '0x1811be0994930fe9480eaede25165608b093ad7a',
            validTo: 2524608000,
        });
        const { sellToken, buyToken, validTo, buyAmount, sellAmount, receiver, feeAmount } = quoteResponse.quote;
    });
}
function signOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new providers_1.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const { sellToken, buyToken, validTo, buyAmount, sellAmount, receiver, feeAmount } = quoteResponse.quote;
        // Prepare the RAW order
        const order = {
            kind: cow_sdk_2.OrderKind.SELL,
            receiver,
            sellToken,
            buyToken,
            partiallyFillable: false,
            // Deadline
            validTo,
            // Limit Price
            //    You can apply some slippage tolerance here to make sure the trade is executed. 
            //    CoW protocol protects from MEV, so it can work with higher slippages
            sellAmount,
            buyAmount,
            // Use the fee you received from the API
            feeAmount,
            // The appData allows you to attach arbitrary information (meta-data) to the order. Its explained in their own section. For now, you can use this 0x0 value
            appData: '0x0000000000000000000000000000000000000000000000000000000000000000'
        };
        // Sign the order
        const signedOrder = yield cow_sdk_2.OrderSigningUtils.signOrder(order, cow_sdk_2.SupportedChainId.MAINNET, signer);
    });
}
