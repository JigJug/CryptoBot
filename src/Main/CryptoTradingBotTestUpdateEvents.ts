import { EMA } from './EMA'
import { LoadExchange } from './DexClients/ExchangeLoader'
import { getBalance } from './CheckWalletBalances'
import { EmiterCollection } from './EmiterCollection'
import { MarketDataObject, SecretKeyObj } from './typings'
const fs = require('fs');


export class CryptoTradingBot {
    pairing
    windowResolution
    marketData
    secretkeyPath
    price
    dex

    buySellTrigger
    bought
    sold
    coin
    dataEmiters
    ema
    dexClient
    secretKey
    
    
    constructor(
        pairing: string,
        windowResolution: string,
        marketData: MarketDataObject,
        secretkeyPath: string,
        price: number,
        dex: string
    ){
        this.pairing = pairing
        this.windowResolution = windowResolution
        this.marketData = marketData
        this.secretkeyPath = secretkeyPath
        this.price = price
        this.dex = dex
        
        this.buySellTrigger = true
        this.bought = false
        this.sold = true
        this.coin = 'RAY'
        this.dataEmiters = new EmiterCollection(this.pairing, this.windowResolution)
        this.ema = new EMA(70)
        this.dexClient = new LoadExchange(this.dex).swapClient();
        this.secretKey = this.getSecretKey();
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
        return this.buy('buy');
    }
    
    buy(side: string){
        this.buySellTrigger = false
        getBalance('USD')
        .then((bal) =>{
            return this.dexClient(bal, side, this.secretKey)
        })
        .then(()=>{
            this.buySellTrigger = true
            this.bought = true 
            this.sold = false        
        })
        .catch((err: Error) => {
            console.log(err);
            this.buySellTrigger = true
        });
    }
            


    getSell(){
        return this.sell('sell');
    }

    sell(side: string){
        this.buySellTrigger = false
        getBalance(this.coin)
        .then((bal) => {
            return this.dexClient(bal, side, this.secretKey)
        })
        .then(()=>{
            this.buySellTrigger = true
            this.sold = true
            this.bought = false
        })
        .catch((err: Error) => {
            console.log(err);
            this.buySellTrigger = true
        });
    }



    calcEma(close: number, emaYesterday: number){
        console.log('calcing ema')
        const ema = this.ema;
        return ema.emaCalc(close, emaYesterday);
    }

    botStatusUpdate(){
        setInterval(()=>{
            console.log(
                `lastdatatime: ${this.marketData.startTime}\n
                price: ${this.price}\n
                ema: ${this.marketData.ema}\n
                volume: ${this.marketData.volume}\n
                bought: ${this.bought}\n
                sold: ${this.sold}\n`
            );
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
    }

    getSecretKey():number[]{
        return this.setSecretKey();
    }

    setSecretKey():number[]{
        let secretKeyString = fs.readFileSync(this.secretkeyPath, "utf8", (err: Error, data: any)=>{
            if(err){
                console.log(err)
                return
            }
        });
        const secretKey: SecretKeyObj = JSON.parse(secretKeyString);
        return secretKey.pk
    }

    //getCoin(): string{

    //}
}