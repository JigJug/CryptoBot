import EventEmitter from "events";
import { DataClient } from "./DataClients/dataclient";

export class MarketDataGrabber {

    client
    eventEmitter

    constructor(client: DataClient, eventEmitter: EventEmitter){
        this.client = client,
        this.eventEmitter = eventEmitter
    }

    sendPrice(){

        const fetcPrice = async () => {
            try{
                const price = await this.client.getPrice();
                this.eventEmitter.emit('SingleMarketData', price);
            }
            catch(err){
                console.log(err);
            }
        }
        
        setInterval(() => {
            fetcPrice();
        },5000)
    }


    
    sendTimeFrameData(lastTime: number){

        let TimeFrame: number = 1000 * 14400//need something to convert numbers to binance naming eg 300 = 4h //parseInt(this.client.config.windowResolution);
        let timeMills: number
        let timeDiff: number
        
        const routineData = async () => {
            try {
                const getMarketData = await this.client.historicMarketData();
                this.eventEmitter.emit('TimeFrameData', getMarketData);
            }
            catch(err){
                console.log(err)
            }
        
        }

        setInterval(() => {
            timeMills = new Date().getTime();
            timeDiff = timeMills - lastTime
            //console.log(timeMills, timeDiff, TimeFrame)
            if(timeDiff > TimeFrame){
                lastTime = lastTime + TimeFrame
                routineData();
            }
        },6000)
    }

}

