import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Liquidity, Token, TokenAmount, Percent } from "@raydium-io/raydium-sdk";

import { fetchAllPoolKeys, fetchPoolKeys } from "./util_mainnet";
import { getTokenAccountsByOwner} from "./util";
const fs = require('fs');

// @ts-ignore
import bs58 from "bs58";

export function raydiumApiSwap(ammount: number, side: string, secretKey: number[]){
    return new Promise<void>((resolve, reject) => {

        const main = async () => {

            const connection = new Connection("https://solana-api.projectserum.com", "confirmed");

            
            const skBuffer = Buffer.from(secretKey)//secretKey.pk);
            const ownerKeypair = Keypair.fromSecretKey(skBuffer);
            const owner = ownerKeypair.publicKey;
            console.log(owner.toString());
            
            try {
                const tokenAccounts = await getTokenAccountsByOwner(connection, owner);
                const RAY_USDC = "6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg";
                //const SOL_USDC = '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'
                console.log('connected token account')
                const poolKeys = await fetchPoolKeys(connection, new PublicKey(RAY_USDC));
                console.log('fetched pool keys')
                if (poolKeys) {
                    const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
                    ammount = ammount * 1000000
                    let coinIn: PublicKey
                    let coinOut: PublicKey
                    if(side == 'buy'){
                        coinIn = poolKeys.quoteMint;
                        coinOut = poolKeys.baseMint;
                    }
                    else{
                        coinIn = poolKeys.baseMint;
                        coinOut = poolKeys.quoteMint;
                    }
                    const amountIn = new TokenAmount(new Token(coinIn, 6), ammount);
                    const currencyOut = new Token(coinOut, 6);
                    const slippage = new Percent(5, 100);
              
                    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
                        poolKeys,
                        poolInfo,
                        amountIn,
                        currencyOut,
                        slippage,
                    });

                    const excPr = () =>{
                        if(executionPrice != null){
                            return executionPrice.toFixed();
                        }
                    }
                    //@ts-ignore
                    console.log(
                        amountOut.toFixed(),
                        minAmountOut.toFixed(),
                        currentPrice.toFixed(),
                        excPr(),
                        priceImpact.toFixed(),
                        fee.toFixed(),
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

                    const signature = await connection.sendTransaction(transaction, [...signers, ownerKeypair], { skipPreflight: true });
                    console.log(signature)
                    //const trany = await connection.getParsedTransaction(txid)

                    //check transaction
                    let timeNow = new Date().getTime();
                    function checkTransactionError(timeNow: number, signature: string){
                        let newtime = new Date().getTime();
                        let tdiff = newtime - timeNow
                        if(tdiff > 30000){
                            return reject(new Error('Transaction not processed'));
                        }
                        const status = connection.getSignatureStatus(signature);
                        status.then((status)=>{
                            if(status.value?.confirmationStatus == 'processed'){
                                if(status.value?.err){
                                    console.log('error');
                                    return reject(new Error('Transaction Failed'));
                                }else{
                                    return resolve();
                                }
                            }
                            return checkTransactionError(timeNow, signature);
                        })
                    }
                    checkTransactionError(timeNow, signature);
                }
            }

            catch(err){
                reject(err)
            }
            
        }
        main();
    })
}