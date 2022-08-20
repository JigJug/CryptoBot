/*
Calculates the ema for a given closing price at the end of the time interval
To find the first ema entry When calculating a data set, the SMA will need to be run first
The SMA value will give the first value of EMA yesterday.
*/

export class EMA{

    period: number
    sma: any
    data: []

    constructor(
        period: number,
        data: []
    ){
        this.period = period
        this.data = data
        this.sma = this.smaCalc()
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
    smaCalc(){
        let totalPrice = 0;

        this.data.map((value: any) => {
            totalPrice += value.close
        })
        
        return totalPrice / this.period
    }

}