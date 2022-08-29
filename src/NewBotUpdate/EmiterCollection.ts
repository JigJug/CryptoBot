import { FtxClient } from './FtxClient';
import { EventEmitter } from 'events';


export class EmiterCollection extends EventEmitter {

    marketName
    windowResolution

    exchangeClient

    constructor(marketname: string, windowResolution: string){
        super();
        this.marketName = marketname
        this.windowResolution = windowResolution

        this.exchangeClient = new FtxClient(this.marketName, this.windowResolution);
    }


    
    sendPrice(){

        let cli = this.exchangeClient;
        
        setInterval(() => {
            cli.ftxGetMarket(false, cli.priceEndpoint)
            .then((ret) => {
                this.emit('Price', ret.result.price)
            })
            .catch((err) =>{
                console.log(err);
            })
        },5000)
    }


    
    sendFourHourData(lastTime: number){

        let cli = this.exchangeClient;

        let fourHour: number = 1000 * 60 * 60 * 4;
        let timeMills: number
        let timeDiff: number

        setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime
            if(timeDiff > fourHour){
                lastTime =+ fourHour

                cli.ftxGetMarket(true, cli.marketDataEndPoint)
                .then((md) => {
                    this.emit('FourHourData', md)
                })
                .catch((err) => {
                    console.log(err)
                });

            }

        },60000)
    }


}

