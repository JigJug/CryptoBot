export class EMA{

    period: number
    sma: any
    fromStart: boolean
    data?: []

    constructor(
        period: number,
        data?: []
    ){
        this.period = period
        this.data = data
        this.sma = this.smaCalc(this.data)
        this.fromStart = false
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
    smaCalc(inputArray: any){
        let totalPrice = 0;
        let currentPrice = 0;
        let sma
        for(let i = 0; i < this.period; i++){
            totalPrice = totalPrice + inputArray[i].close; 
        }
        
        return totalPrice / this.period
    }

}