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
            return () => {
                return new Promise((reject)=>{
                    reject(new Error('can not load exchange'))
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