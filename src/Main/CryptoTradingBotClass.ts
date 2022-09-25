import { LoadExchange } from './DexClients/ExchangeLoader'
import { getBalance } from './Utils/CheckWalletBalances'
import { indicators, MarketDataObject, SecretKeyObj, SingleMarketObject } from './typings'
import { LoadStrategy } from './Strategy/LoadStrategy'
import { FtxClient } from './DataClients/FtxClient'
import { EventEmitter } from 'events';
import { MarketDataGrabber } from './MarketDataGrabber'
const fs = require('fs');



export class CryptoTradingBot {
    pairing
    windowResolution
    marketData
    secretkeyPath
    price
    dex
    stopLoss
    indicators

    buySellTrigger
    bought
    sold
    coin

    events
    dataClient
    marketDataGrabber
    dexClient
    secretKey
    strategy
    
    constructor(
        pairing: string,
        windowResolution: string,
        marketData: MarketDataObject,
        secretkeyPath: string,
        price: number,
        dex: string,
        stopLoss: number,
        indicators: indicators
    ){
        this.pairing = pairing
        this.windowResolution = windowResolution
        this.marketData = marketData
        this.secretkeyPath = secretkeyPath
        this.price = price
        this.dex = dex
        this.stopLoss = stopLoss
        this.indicators = indicators
        
        this.buySellTrigger = true
        this.bought = false
        this.sold = true
        this.coin = 'RAY'
        //load the data and dex clients, emitters, secretkey and strategy
        this.events = this.getEventEmitter();
        this.dataClient = this.getDataClient();
        this.marketDataGrabber = this.getMarketDataGrabber();
        this.dexClient = this.getDex();
        this.secretKey = this.getSecretKey();
        this.strategy = this.getStrategy();
    }

    startBot(){
        this.setStartBot();
    }

    setStartBot(){
        this.getPrice();
        this.getTimeFrameData();
        this.botStatusUpdate();
        this.buySellListeners();
    }



    //current price
    getPrice(){
        return this.setPrice();
    }

    setPrice(){
        this.marketDataGrabber.sendSingleMarketData();
        this.events.on('SingleMarketData', (SingleMarketData: SingleMarketObject) => {
            this.price = SingleMarketData.price;
            this.strategy.buySellLogic(SingleMarketData, this.indicators ,this.sold, this.bought, this.buySellTrigger);
        })

    }
    testPrice(){
        return this.price;
    }



    //4hour data
    getTimeFrameData(){
        return this.setTimeFrameData();
    }

    setTimeFrameData(){
        let lastTime = this.marketData.time;

        this.marketDataGrabber.sendTimeFrameData(lastTime);

        this.events.on('TimeFrameData', (md: MarketDataObject) => {
            this.updateIndicators(md);
            this.updateMarketData(md);
            console.log('updated market data: \n' + this.marketData.time + '\n');
            console.log('ema:: ',  this.indicators.ema);
        })

    }



    //buying and selling
    buySellListeners(){

        this.events.on('Buy', (buy: boolean) => {
            console.log('recieved buy signal');
            if(buy && this.buySellTrigger && this.sold){
                this.getBuy();
            }
        });

        this.events.on('Sell', (sell: boolean) => {
            console.log('recieved sell signal');
            if(sell && this.buySellTrigger && this.bought){
                this.getSell();
            }
        })

    }



    getBuy(){
        return this.buy('buy');
    }
    
    buy(side: string){
        this.buySellTrigger = false;
        getBalance('USD')
        .then((bal) =>{
            return this.dexClient(bal, side, this.secretKey, this.pairing);
        })
        .then(()=>{
            this.buySellTrigger = true;
            this.bought = true;
            this.sold = false;
        })
        .catch((err: Error) => {
            console.log(err);
            this.buySellTrigger = true;
        });
    }



    getSell(){
        return this.sell('sell');
    }

    sell(side: string){
        this.buySellTrigger = false;
        getBalance(this.coin)
        .then((bal) => {
            return this.dexClient(bal, side, this.secretKey, this.pairing);
        })
        .then(()=>{
            this.buySellTrigger = true;
            this.sold = true;
            this.bought = false;
        })
        .catch((err: Error) => {
            console.log(err);
            this.buySellTrigger = true;
        });
    }



    botStatusUpdate(){
        setInterval(()=>{
            console.log(
                `lastdatatime: ${this.marketData.startTime}\n
                price: ${this.price}\n
                volume: ${this.marketData.volume}\n
                bought: ${this.bought}\n
                sold: ${this.sold}\n
                buyselltrigger : ${this.buySellTrigger}`
            );
        }, 120000);
    }

    

    updateMarketData(md: MarketDataObject){
        console.log('updating market data' );
        this.marketData.startTime = md.startTime;
        this.marketData.time = md.time;
        this.marketData.open = md.open;
        this.marketData.high = md.high;
        this.marketData.low = md.low;
        this.marketData.close = md.close;
        this.marketData.volume = md.volume;
    }

    updateIndicators(md: MarketDataObject){
        this.indicators = this.strategy.updateIndicators(md, this.indicators);
    }



    getSecretKey():number[]{
        return this.setSecretKey();
    }

    setSecretKey():number[]{
        let secretKeyString = fs.readFileSync(this.secretkeyPath, "utf8", (err: Error, data: any)=>{
            if(err){
                console.log(err);
                return
            }
        });
        const secretKey: SecretKeyObj = JSON.parse(secretKeyString);
        return secretKey.pk
    }

    getEventEmitter(){
        return new EventEmitter();
    }

    getDataClient(){
        return new FtxClient(this.pairing, this.windowResolution);
    }

    getMarketDataGrabber(){
        return new MarketDataGrabber(this.dataClient, this.events);
    }

    getStrategy(){
        const strategy = this.setStrategy();
        return new strategy(this.stopLoss, this.events)
    }

    setStrategy(){
        return new LoadStrategy('simpleema').loadStrategy();
    }

    getDex(){
        return new LoadExchange(this.dex).swapClient();
    }

}