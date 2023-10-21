import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig, OrcaPoolToken} from "@orca-so/sdk";
import Decimal from "decimal.js";


export function orcaApiSwap(ammount: number, side: string, secretKey: Uint8Array |null, pairing: string){
    return new Promise<void>((resolve, reject) => {

        const swap = async () => {

            console.log('swapping through orca dex')
            //Get the orca pool from pairing
            let orcaPairing1: string = pairing.replace('/', '_')
            let orcaPairing: string = orcaPairing1.replace('T', 'C')
            const fromOrcaPoolConfig = OrcaPoolConfig[`${orcaPairing}` as keyof typeof OrcaPoolConfig]

            //Read secret key file to get owner keypair
            //const unit8Sk = Uint8Array.from(secretKey);
            const owner = Keypair.fromSecretKey(secretKey!);

            //Initialzie Orca object with mainnet connection
            const connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");
            const orca = getOrca(connection);
          
            try {
                const orcaPool = orca.getPool(fromOrcaPoolConfig); // get the liquidity pool key

                const orcaToken = (side: string):OrcaPoolToken => {
                    if(side =='sell') return orcaPool.getTokenA(); //token A from first token
                    else return orcaPool.getTokenB(); //token B from second token
                }

                const orcaAmount = new Decimal(ammount);
                const slippage = new Decimal(0.05)
                const quote = await orcaPool.getQuote(orcaToken(side), orcaAmount, slippage);
                const usdcAmount = quote.getMinOutputAmount();
          
                console.log(`Swap ${orcaAmount.toString()} ${orcaPool.getTokenA().name} for at least ${usdcAmount.toNumber()} usdc (${side})`);
                const swapPayload = await orcaPool.swap(owner, orcaToken(side), orcaAmount, usdcAmount);
                const swapTxId = await swapPayload.execute();
                console.log("Swapped:", swapTxId, "\n");
                resolve();
          
          
            } catch (err) {
                console.warn(err);
                reject(err)
            }
        };
          
        swap();


    })
}

