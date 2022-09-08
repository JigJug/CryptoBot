import { FtxClient } from './FtxClient';
import { EventEmitter } from 'events';
import {MarketDataObject, SingleMarketObject} from './typings'


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

        const fetchPrie = async () => {
            try{
                const price = await cli.ftxGetMarket(false, cli.priceEndpoint);
                this.emit('Price', price.result.price);
            }
            catch(err){
                console.log(err);
            }
        }
        
        setInterval(() => {
            fetchPrie();
        },5000)
    }


    
    sendFourHourData(lastTime: number, windowResolution: number){

        let fourHour: number = 1000 * windowResolution;
        let timeMills: number
        let timeDiff: number
        
        let cli = this.exchangeClient;
        const routineData = async () => {
            try {
                const getMarketData = await cli.ftxGetMarket(true, cli.marketDataEndPoint);
                this.emit('FourHourData', getMarketData)
            }
            catch(err){
                console.log(err)
            }
        
        }

        setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime
            if(timeDiff > fourHour){
                lastTime = lastTime + fourHour
                routineData();
            }
        },6000)
    }


}

