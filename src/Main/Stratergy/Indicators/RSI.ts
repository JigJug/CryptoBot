import { MarketDataObject } from "../../typings"

export class RSI{

    period: number

    constructor(
        period: number,
        rsiData: []
    ){
        this.period = period
    }

    //methods
    rsiStepOne(data: MarketDataObject[]){
        //rsi step 1
        const averageGainLoss = (data: MarketDataObject[]) => {
            let avGain: number = 0
            let avLoss: number = 0
            let previousPrice: number = data[0].close
            for(let i = 1; i < this.period; i++){
                let difference = data[i].close - previousPrice;
                if(difference < 0){
                    difference = difference - difference - difference;
                    avLoss = avLoss + difference
                }else if(difference > 0){
                    avGain = avGain + difference
                }
                if(i == this.period){
                    avGain = avGain / this.period;
                    avLoss = avLoss / this.period;
                    let rs = avGain / avLoss
                    let rsi = 100 - (100/(1 + rs))
                    return {
                        rsi: rsi,
                        avGain: avGain,
                        avLoss: avLoss
                    }
                }
                previousPrice = data[i].close;
            }
        }

        return averageGainLoss(data)

    }

}