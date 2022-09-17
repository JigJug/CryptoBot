import { FtxClient } from './CexClients/FtxClient';
import { EventEmitter } from 'events';
import {MarketDataObject, SingleMarketObject} from './typings'


export class EmiterCollection extends EventEmitter {

    constructor(){
        super();
    }

    sendPrice(exchangeClient: FtxClient){

        let cli = exchangeClient;

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


    
    sendTimeFrameData(exchangeClient: FtxClient, lastTime: number, windowResolution: number){

        let TimeFrame: number = 1000 * windowResolution;
        let timeMills: number
        let timeDiff: number
        
        let cli = exchangeClient;
        const routineData = async () => {
            try {
                const getMarketData = await cli.ftxGetMarket(true, cli.marketDataEndPoint);
                this.emit('TimeFrameData', getMarketData);
            }
            catch(err){
                console.log(err)
            }
        
        }

        setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime
            if(timeDiff > TimeFrame){
                lastTime = lastTime + TimeFrame
                routineData();
            }
        },6000)
    }


    sendBuySignal(){
        this.emit('Buy', true);
    }

    sendSellSignal(){
        this.emit('Sell', true);
    }


}

