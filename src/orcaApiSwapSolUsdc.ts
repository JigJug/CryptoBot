const fs = require('fs')
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

export function orcaApiSwap(path:string){
    return new Promise<void>((resolve, reject) => {

        const main = async () => {

            /*** Setup ***/
            // 1. Read secret key file to get owner keypair2
            //path = secret key filepath
            let secretKeyString = fs.readFileSync(path, "utf8", (err: Error, data: any)=>{
                if(err){
                    console.log(err)
                    return
                }
            });
            secretKeyString = JSON.parse(secretKeyString)
            const secretKey = Uint8Array.from(secretKeyString.pk);
            const owner = Keypair.fromSecretKey(secretKey);

            // 2. Initialzie Orca object with mainnet connection
            const connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");
            const orca = getOrca(connection);
          
            try {
                /*** Swap ***/
                // 3. We will be swapping 0.1 SOL for some ORCA
                const solUsdcPool = orca.getPool(OrcaPoolConfig.SOL_USDC); // get the liquidity pool
                const solToken = solUsdcPool.getTokenA(); //or getTokenB(); // get the token a or b from pool name
                const solAmount = new Decimal(0.27);
                const quote = await solUsdcPool.getQuote(solToken, solAmount);
                const usdcAmount = quote.getMinOutputAmount();
          
                console.log(`Swap ${solAmount.toString()} sol for at least ${usdcAmount.toNumber()} usdc`);
                const swapPayload = await solUsdcPool.swap(owner, solToken, solAmount, usdcAmount);
                const swapTxId = await swapPayload.execute();
                console.log("Swapped:", swapTxId, "\n");
          
          
            } catch (err) {
                console.warn(err);
            }
        };
          
        main()
        .then(() => {
            console.log("Done");
            resolve()
        })
        .catch((e) => {
            console.error(e);
            reject()
        });

    })
}

