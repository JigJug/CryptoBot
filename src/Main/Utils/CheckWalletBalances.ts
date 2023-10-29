import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function chekckWalletBalance(coin: string){
    return new Promise<number>((resolve, reject) => {

        console.log('running balances!')

        const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

        let pubKey = '8Vp83HeSX1YavzXhSsKyrZpRzjwJAbPxd6zyLp5YuTBF'
        let wallet = new PublicKey(pubKey);
    
        let usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        let mintWalletUsdc = new PublicKey(usdcMint);
    
        let orcaMint = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'
        let mintWalletOrca = new PublicKey(orcaMint);

        let rayMint = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'
        let mintWalletray = new PublicKey(rayMint);

        const main = async () => {
            try {
                //sol
                const balance = await connection.getBalance(wallet);
                console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
    
                //usdc
                const balanceUsdc = await connection.getParsedTokenAccountsByOwner(
                    wallet, { mint: mintWalletUsdc }
                );
                const balanceUsdcParsed = balanceUsdc.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`usdc balance: ${balanceUsdcParsed}`)
                let inBalUsdc = parseInt(balanceUsdcParsed)

                //orca
                const balanceOrca = await connection.getParsedTokenAccountsByOwner(
                    wallet, { mint: mintWalletOrca }
                );
                const balanceOrcaParsed = balanceOrca.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`orca balance: ${balanceOrcaParsed}`)
                let inBalOrca = parseInt(balanceOrcaParsed)

                //ray
                //const balanceRay = await connection.getParsedTokenAccountsByOwner(
                //    wallet, { mint: mintWalletray }
                //);
                //const balanceRayParsed = balanceRay.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
                //console.log(`ray balance: ${balanceRayParsed}`)
                //let inBalRay = parseInt(balanceRayParsed)

                if(coin == 'ORCA'){
                    resolve(inBalOrca);
                } else if(coin == 'SOL'){
                    resolve((balance/LAMPORTS_PER_SOL) - 0.04);
                } else {
                    resolve(inBalUsdc);
                }
            }
            catch (err){
                console.log(err)
                reject(err)
            }
        }
        main();
    })
}

export function getBalance(coin: string){
    return chekckWalletBalance(coin);
}

