import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Liquidity,
  Token,
  TokenAmount,
  Percent,
} from "@raydium-io/raydium-sdk";
import { fetchPoolKeys } from "./util_mainnet";
import { getTokenAccountsByOwner } from "./util";
import { RaydiumPools } from "./RaydiumPools";

export function raydiumApiSwap(
  ammount: number,
  side: string,
  secretKey: Uint8Array | null,
  pairing: string
) {
  return new Promise<void>((resolve, reject) => {
    const swap = async () => {
      let raydiumPairing: string = pairing.replace("/", "_");
      const fromRaydiumPools =
        RaydiumPools[raydiumPairing as keyof typeof RaydiumPools];
      console.log(`fetched pool key ${raydiumPairing}: ${fromRaydiumPools}`);

      const connection = new Connection(
        "https://solana-api.projectserum.com",
        "confirmed"
      );
      const skBuffer = Buffer.from(secretKey!);
      const ownerKeypair = Keypair.fromSecretKey(skBuffer);
      const owner = ownerKeypair.publicKey;

      try {
        const tokenAccounts = await getTokenAccountsByOwner(connection, owner);
        console.log("connected token account");
        const poolKeys = await fetchPoolKeys(
          connection,
          new PublicKey(fromRaydiumPools)
        );
        console.log(`fetched pool keys: ${poolKeys}`);
        console.log(poolKeys.marketBids);

        if (poolKeys) {
          const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
          ammount = ammount * 1000000;
          let coinIn: PublicKey;
          let coinOut: PublicKey;
          if (side == "buy") {
            coinIn = poolKeys.quoteMint;
            coinOut = poolKeys.baseMint;
          } else {
            coinIn = poolKeys.baseMint;
            coinOut = poolKeys.quoteMint;
          }

          const amountIn = new TokenAmount(new Token(coinIn, 6), ammount);
          const currencyOut = new Token(coinOut, 6);
          const slippage = new Percent(5, 100);

          const {
            amountOut,
            minAmountOut,
            currentPrice,
            executionPrice,
            priceImpact,
            fee,
          } = Liquidity.computeAmountOut({
            poolKeys,
            poolInfo,
            amountIn,
            currencyOut,
            slippage,
          });

          const excPr = () => {
            if (executionPrice != null) {
              return executionPrice.toFixed();
            }
          };

          console.log(
            amountOut.toFixed(),
            minAmountOut.toFixed(),
            currentPrice.toFixed(),
            excPr(),
            priceImpact.toFixed(),
            fee.toFixed()
          );

          const { transaction, signers } = await Liquidity.makeSwapTransaction({
            connection,
            poolKeys,
            userKeys: {
              tokenAccounts,
              owner,
            },
            amountIn,
            amountOut: minAmountOut,
            fixedSide: "in",
          });

          const signature = await connection.sendTransaction(
            transaction,
            [...signers, ownerKeypair],
            { skipPreflight: true }
          );
          console.log(signature);

          //check transaction
          let timeNow = new Date().getTime();

          function checkTransactionError(timeNow: number, signature: string) {
            let newtime = new Date().getTime();
            let tdiff = newtime - timeNow;
            if (tdiff > 30000) {
              return reject(new Error("Transaction not processed"));
            }

            const checkConfirmation = async () => {
              const status = await connection.getSignatureStatus(signature);

              if (status.value?.confirmationStatus == "confirmed") {
                if (status.value?.err) {
                  console.log("error");
                  return reject(new Error("Transaction Failed"));
                } else {
                  return resolve();
                }
              }
              checkTransactionError(timeNow, signature);
            };
            return checkConfirmation();
          }

          checkTransactionError(timeNow, signature);
        }
      } catch (err) {
        reject(err);
      }
    };
    swap();
  });
}
