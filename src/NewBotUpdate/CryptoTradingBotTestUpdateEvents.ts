import { EMA } from '../Main/EMA'
import { orcaApiSwapSell } from '../OrcaSwaps/orcaApiSwapRayUsdcSell'
import { orcaApiSwapBuy } from '../OrcaSwaps/orcaApiSwapUsdcRayBuy'
import { EmiterCollection } from './EmiterCollection'
import { MarketDataObject } from './typings'


export class CryptoTradingBot {
    pairing
    windowResolution
    marketData
    secretkeyPath
    ammountUsdc
    price

    buySellTrigger
    bought
    sold
    ammountCoin
    dataEmiters
    ema
    timeMills
    timeDiff
    
    constructor(
        pairing: string,
        windowResolution: string,
        marketData: MarketDataObject,
        secretkeyPath: string,
        ammountUsdc: number,
        price: number,
    ){
        this.pairing = pairing
        this.windowResolution = windowResolution
        this.marketData = marketData
        this.secretkeyPath = secretkeyPath
        this.ammountUsdc = ammountUsdc
        this.price = price
        
        this.buySellTrigger = true
        this.bought = true
        this.sold = false
        this.ammountCoin = 13
        this.dataEmiters = new EmiterCollection(this.pairing, this.windowResolution)
        this.ema = new EMA(70)
        this.timeMills = 0
        this.timeDiff = 0
    }

    startBot(){
        console.log(' cryptobotclass:: running startBot')
        return this.setStartBot();
    }

    setStartBot(){
        this.getPrice();
        this.getFourHourData();
        this.botStatusUpdate();
    }

    //current price
    getPrice(){
        return this.setPrice();
    }

    setPrice(){
        this.dataEmiters.sendPrice();
        this.dataEmiters.on('Price', (price: number) => {
            this.price = price;
            this.buySellLogic(price, this.marketData.ema);
        })

    }
    testPrice(){
        return this.price;
    }


    //4hour data
    getFourHourData(){
        return this.setFourHourData();
    }
    setFourHourData(){
        let lastTime = this.marketData.time
        let wr = parseInt(this.windowResolution);
        this.dataEmiters.sendFourHourData(lastTime, wr);
        this.dataEmiters.on('FourHourData', (md: MarketDataObject) => {
            console.log('set4hrdata')
            md.ema =  this.calcEma(md.close, this.marketData.ema);
            
            this.updateMarketData(md);
            console.log('updated market data: \n' + this.marketData.time + '\n');
        })

    }



    //buying and selling

    buySellLogic(price: number, emaYesterday: number){
        //buy
        if(price > emaYesterday){
            if(this.buySellTrigger && this.sold){
                this.buySellTrigger = false
                this.getBuy();
            }
        }
        else if(this.price < emaYesterday){
            if(this.buySellTrigger && this.bought){
                this.buySellTrigger = false
                this.getSell();
            }
        }
    }


    getBuy(){
        return this.buy();
    }
    
    buy(){
        this.buySellTrigger = false
        orcaApiSwapBuy(this.secretkeyPath, this.ammountUsdc)
        .then((ammount: number)=>{
            this.ammountCoin = ammount
            this.buySellTrigger = true
            this.bought = true 
            this.sold = false        
        })
        .catch((err: Error) => {
            console.log(err);
        });
    }
            


    getSell(){
        return this.sell();
    }

    sell(){
        this.buySellTrigger = false
        orcaApiSwapSell(this.secretkeyPath, this.ammountCoin)
        .then((ammount: number)=>{
            this.ammountUsdc = ammount
            this.buySellTrigger = true
            this.sold = true
            this.bought = false
        })
        .catch((err: Error) => {
            console.log(err);
        });
    }



    calcEma(close: number, emaYesterday: number){
        console.log('calcing ema')
        const ema = this.ema;
        return ema.emaCalc(close, emaYesterday);
    }

    botStatusUpdate(){
        this.dataEmiters.on('BotStatusUpdate', (timeMills, timeDiff) => {
            this.timeMills = timeMills;
            this.timeDiff = timeDiff;
        })
        setInterval(()=>{
            
            console.log('timenow: ' + this.timeMills);
            console.log('lastdatatime: ' + this.marketData.time);
            console.log('timediff: ' + this.timeDiff);
            console.log('price: ' + this.price);
            console.log('ema: ' + this.marketData.ema);
            console.log('volume: ' + this.marketData.volume);
            console.log('bought: ' + this.bought);
            console.log('sold: ' + this.sold + '\n');
            console.log('ammount usd = '+ this.ammountUsdc);
            console.log('ammount coin = ' + this.ammountCoin);
        }, 120000)
    }

    
    updateMarketData(md: MarketDataObject){
        console.log('updating market data' )
        this.marketData.startTime = md.startTime
        this.marketData.time = md.time
        this.marketData.open = md.open
        this.marketData.high = md.high
        this.marketData.low = md.low
        this.marketData.close = md.close
        this.marketData.volume = md.volume
        this.marketData.ema = md.ema
        console.log('updating market data : EMA = ' + this.marketData.ema)
        
    }
}