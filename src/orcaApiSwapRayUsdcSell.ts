const fs = require('fs')
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

export function orcaApiSwapSell(path:string, ammount: number){
    return new Promise<number>((resolve, reject) => {

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
                const rayUsdcPool = orca.getPool(OrcaPoolConfig.RAY_USDC); // get the liquidity pool
                const rayToken = rayUsdcPool.getTokenA(); //or getTokenB(); // get the token a or b from pool name
                const rayAmount = new Decimal(ammount);
                const quote = await rayUsdcPool.getQuote(rayToken, rayAmount);
                const usdcAmount = quote.getMinOutputAmount();
          
                console.log(`Swap ${rayAmount.toString()} ray for at least ${usdcAmount.toNumber()} usdc`);
                const swapPayload = await rayUsdcPool.swap(owner, rayToken, rayAmount, usdcAmount);
                const swapTxId = await swapPayload.execute();
                console.log("Swapped:", swapTxId, "\n");
                let returnNum = Math.trunc(usdcAmount.toNumber())
                resolve(returnNum);
          
          
            } catch (err) {
                console.warn(err);
                reject(err);
            }
        };
          
        main()
        .then(() => {
            console.log("finished orca transaction");
            //resolve()
        })
        .catch((e) => {
            console.error(e);
            reject();
        });

    })
}

