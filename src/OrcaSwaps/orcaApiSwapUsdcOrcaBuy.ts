const fs = require('fs')
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

export function orcaApiSwapBuy(path:string, ammount: number){
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
                const orcaUsdcPool = orca.getPool(OrcaPoolConfig.ORCA_USDC); // get the liquidity pool
                const usdcToken = orcaUsdcPool.getTokenB(); //or getTokenA(); // get the token a or b from pool name
                const usdcAmount = new Decimal(ammount);
                const slippage = new Decimal(0.05)
                const quote = await orcaUsdcPool.getQuote(usdcToken, usdcAmount, slippage);
                const orcaAmount = quote.getMinOutputAmount();
          
                console.log(`Swap ${usdcAmount.toString()} usdc for at least ${orcaAmount.toNumber()} orca`);
                const swapPayload = await orcaUsdcPool.swap(owner, usdcToken, usdcAmount, orcaAmount);
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

