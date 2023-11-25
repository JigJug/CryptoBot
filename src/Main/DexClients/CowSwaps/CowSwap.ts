import { OrderBookApi } from "@cowprotocol/cow-sdk";
import {
  OrderSigningUtils,
  OrderKind,
  SupportedChainId,
} from "@cowprotocol/cow-sdk";
import { Web3Provider } from "@ethersproject/providers";

/**
 * to make an order we need to:
 * Get Market Price: Fee & Price
 * Sign the order: Using off-chain signing or Meta-transactions
 * Post the signed order to the API: So, the order becomes OPEN
 *
 * **MAKE SURE YOU HAVE ENABLED SELL TOKEN IN YOUR WALLET**
 */

async function getMarketPrice() {
  const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.MAINNET });

  const quoteResponse = await orderBookApi.getQuote({
    kind: OrderKind.SELL, // Sell order (could also be BUY)
    sellToken: "0xc778417e063141139fce010982780140aa0cd5ab", // WETH
    buyToken: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b", // USDC
    amount: "1000000000000000000", // 1 WETH
    userAddress: "0x1811be0994930fe9480eaede25165608b093ad7a", // Trader
    validTo: 2524608000,
  });

  const {
    sellToken,
    buyToken,
    validTo,
    buyAmount,
    sellAmount,
    receiver,
    feeAmount,
  } = quoteResponse.quote;
}

async function signOrder() {
  const provider = new Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const {
    sellToken,
    buyToken,
    validTo,
    buyAmount,
    sellAmount,
    receiver,
    feeAmount,
  } = quoteResponse.quote;

  // Prepare the RAW order
  const order = {
    kind: OrderKind.SELL, // SELL or BUY
    receiver, // Your account or any other
    sellToken,
    buyToken,

    partiallyFillable: false, // "false" is for a "Fill or Kill" order, "true" for allowing "Partial execution" which is not supported yet
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
    appData:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  };

  // Sign the order
  const signedOrder = await OrderSigningUtils.signOrder(
    order,
    SupportedChainId.MAINNET,
    signer
  );
}
