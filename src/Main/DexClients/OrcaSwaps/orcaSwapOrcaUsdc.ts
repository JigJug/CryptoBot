const fs = require('fs')
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig, OrcaPoolToken, OrcaToken } from "@orca-so/sdk";
import Decimal from "decimal.js";



export function orcaApiSwap(ammount: number, side: string, secretKey: number[]){
    return new Promise<void>((resolve, reject) => {

        const main = async () => {

            /*** Setup ***/
            // 1. Read secret key file to get owner keypair2

            const unit8Sk = Uint8Array.from(secretKey);
            const owner = Keypair.fromSecretKey(unit8Sk);

            // 2. Initialzie Orca object with mainnet connection
            const connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");
            const orca = getOrca(connection);
          
            try {
                /*** Swap ***/
                // 3. We will be swapping 0.1 SOL for some ORCA
                const orcaUsdcPool = orca.getPool(OrcaPoolConfig.ORCA_USDC); // get the liquidity pool

                const orcaToken = (side: string):OrcaPoolToken => {
                    if(side =='sell'){
                        return orcaUsdcPool.getTokenA(); //or getTokenB(); // get the token a or b from pool name
                    }
                    else {
                        return orcaUsdcPool.getTokenB(); //or getTokenB(); // get the token a or b from pool name
                    }
                }

                const orcaAmount = new Decimal(ammount);
                const slippage = new Decimal(0.05)
                const quote = await orcaUsdcPool.getQuote(orcaToken(side), orcaAmount, slippage);
                const usdcAmount = quote.getMinOutputAmount();
          
                console.log(`Swap ${orcaAmount.toString()} ${side} for at least ${usdcAmount.toNumber()} `);
                const swapPayload = await orcaUsdcPool.swap(owner, orcaToken(side), orcaAmount, usdcAmount);
                const swapTxId = await swapPayload.execute();
                console.log("Swapped:", swapTxId, "\n");
                resolve();
          
          
            } catch (err) {
                console.warn(err);
                reject(err)
            }
        };
          
        main();


    })
}

