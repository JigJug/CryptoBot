import { orcaApiSwap } from "./OrcaSwaps/orcaSwapOrcaUsdc";
import { raydiumApiSwap } from "./RaydiumSwaps/RaydiumSwapRayUsdc"


export class LoadExchange{

    exchange

    constructor(exchange: string){
        this.exchange = exchange
    }

    swapClient(){
        if(this.exchange == 'orca'){
            return this.getOrca();
        }
        else{
            return this.getRaydium();
        }
    }

    getOrca(){
        return orcaApiSwap
    }

    getRaydium(){
        return raydiumApiSwap
    }



}