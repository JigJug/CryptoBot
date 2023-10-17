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

        let TimeFrame: number = 1000 * parseInt(this.client.config.windowResolution);
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
            if(timeDiff > TimeFrame){
                lastTime = lastTime + TimeFrame
                routineData();
            }
        },6000)
    }

}

