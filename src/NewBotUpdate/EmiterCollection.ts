import { FtxClient } from './FtxClient';
import { EventEmitter } from 'events';
import {MarketDataObject} from './typings'


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


    
    sendFourHourData(lastTime: number, windowResolution: number){

        let cli = this.exchangeClient;

        let fourHour: number = 1000 * windowResolution;
        let timeMills: number
        let timeDiff: number

        setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime
            console.log('timediff = ' + timeDiff)
            if(timeDiff > fourHour){
                lastTime = lastTime + fourHour

                cli.ftxGetMarket(true, cli.marketDataEndPoint)
                .then((md: any) => {
                    this.emit('FourHourData', md)
                })
                .catch((err) => {
                    console.log(err)
                });

            }
            this.emit('BotStatusUpdate', timeMills, timeDiff)

        },6000)
    }


}

