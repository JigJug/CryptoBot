/*
Calculates the ema for a given closing price at the end of the time interval
To find the first ema entry When calculating a data set, the SMA will need to be run first
The SMA value will give the first value of EMA yesterday.
*/
import { MarketDataObject } from "./typings"
export class EMA{

    period: number
    sma: any
    data: any

    constructor(
        period: number,
    ){
        this.period = period
    }

    //methods
    emaCalc(priceToday: number, emaYesterday: number){

        let N: number = this.period
        let t: number = priceToday
        let y: number = emaYesterday
        let k: number = (2 / (N + 1))
        let emaToday = (t * k) + (y * (1 - k))
        
        return emaToday
    }
    //only use this if you need to calc full ema. runs once to get the sma
    //need sma to use as the first value of ema yesterday, then from there
    //can calc the ema
    smaCalc(data: [MarketDataObject]){
        let totalPrice = 0;

        for(let i = 0; i < this.period; i++){
            totalPrice = totalPrice + data[i].close; 
        }
        
        return totalPrice / this.period
    }

}