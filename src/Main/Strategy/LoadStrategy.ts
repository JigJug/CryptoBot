import { SimpleEmaStrategy } from "./Strategies/SimpleEma";

export class LoadStrategy{

    strategy

    constructor(strategy: string){
        this.strategy = strategy
    }

    loadStrategy(){
        //if(this.strategy == 'SimpleEMA'){
            return SimpleEmaStrategy
        //}
    }

}