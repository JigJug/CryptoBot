import { orcaApiSwap } from "./OrcaSwaps/orcaSwap";
import { raydiumApiSwap } from "./RaydiumSwaps/RaydiumSwap"


export class LoadExchange{

    exchange

    constructor(exchange: string){
        this.exchange = exchange
    }

    swapClient(){
        if(this.exchange == 'orca'){
            return this.getOrca();
        }
        else if(this.exchange == 'raydium'){
            return this.getRaydium();
        }
        else{
            return (ammount: number, side: string, secretKey: Uint8Array|null, pairing: string) => {
                return new Promise((resolve, reject)=>{
                    reject(new Error('can not load exchange: check the bot configs'))
                })
            }
        }
    }

    getOrca(){
        return orcaApiSwap
    }

    getRaydium(){
        return raydiumApiSwap
    }



}