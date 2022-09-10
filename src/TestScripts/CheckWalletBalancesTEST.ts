
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Console } from "console";

function chekckWalletBalance(){
    return new Promise<number>((resolve, reject) => {

        const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

        let pubKey = '8Vp83HeSX1YavzXhSsKyrZpRzjwJAbPxd6zyLp5YuTBF'
        const wallet = new PublicKey(pubKey);
    
        let usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        let mintWalletUsdc = new PublicKey(usdcMint);
    
        let orcaMint = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'
        let mintWalletOrca = new PublicKey(orcaMint);
    
        const main = async () => {
            try {
                //sol
                //const balance = await connection.getBalance(wallet);
                //console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
    
                //usdc
                //const txl = await connection.getSignaturesForAddress(wallet)
                //console.log(txl[0].err)

                const sig = await connection.getParsedTransaction('zCWsYTzfhr7EZdk1AMWMBanwYYBjZbAboD5PBdvFVdc5fW6L7WGKoadDgQVZYfHFZ8MVSSUvFaWtisLNS72kT5h');
                console.log(sig)
                const status = await connection.getSignatureStatus('zCWsYTzfhr7EZdk1AMWMBanwYYBjZbAboD5PBdvFVdc5fW6L7WGKoadDgQVZYfHFZ8MVSSUvFaWtisLNS72kT5h')
                    console.log('SIG STATUS::::::: ' + status.context.slot)
                if(status.value?.err){
                    console.log('found error')
                }


                
            }
            catch (err){
                console.log(err)
                reject(err)
            }
            
            
        }
    
        main()
        .then(() => {
            console.log('done')
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })

    })


}

chekckWalletBalance();

