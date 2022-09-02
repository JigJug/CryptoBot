
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function chekckWalletBalance(usdc:boolean){
    return new Promise<number>((resolve, reject) => {

        const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

        let pubKey = '8Vp83HeSX1YavzXhSsKyrZpRzjwJAbPxd6zyLp5YuTBF'
        let wallet = new PublicKey(pubKey);
    
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
                const balanceUsdc = await connection.getParsedTokenAccountsByOwner(
                    wallet, { mint: mintWalletUsdc }
                );
                const balanceUsdcParsed = balanceUsdc.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`uscd balance: ${balanceUsdcParsed}`)
                let inBalUsdc = parseInt(balanceUsdcParsed)

    
                //orca
                const balanceOrca = await connection.getParsedTokenAccountsByOwner(
                    wallet, { mint: mintWalletOrca }
                );
                const balanceOrcaParsed = balanceOrca.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`orca balance: ${balanceOrcaParsed}`)
                let inBalOrca = parseInt(balanceOrcaParsed)

                if(usdc){
                    resolve(inBalUsdc);
                }
                else{
                    resolve(inBalOrca);
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

export function getBalance(uscdc:boolean){
    return chekckWalletBalance(uscdc);
}

