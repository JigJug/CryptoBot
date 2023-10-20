import { LoadExchange } from './DexClients/ExchangeLoader'
import { getBalance } from './Utils/CheckWalletBalances'
import { BotConfig, indicators, MarketDataObject, SecretKeyObj, SingleMarketObject } from '../typings'
import { LoadStrategy } from './Strategy/LoadStrategy'
import { FtxClient } from './DataClients/clients/FtxClient'
import { EventEmitter } from 'events';
import { MarketDataGrabber } from './marketdata'
import * as fs from 'fs'
import { DataClient } from './DataClients/dataclient'

class CryptoTradingBot {
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
        botConfig: BotConfig,
        indicators: indicators,
        dataClient: DataClient
    ){
        this.pairing = botConfig.pairing
        this.windowResolution = botConfig.windowResolution
        this.marketData = botConfig.data
        this.secretkeyPath = botConfig.secretKeyPath
        this.price = botConfig.data?.close
        this.dex = botConfig.dex
        this.stopLoss = botConfig.stopLoss
        this.indicators = indicators
        
        this.buySellTrigger = true
        this.bought = true
        this.sold = false
        this.coin = 'RAY'
        //load the data and dex clients, emitters, secretkey and strategy
        this.events = this.setEventEmitter();
        this.dataClient = dataClient;
        this.marketDataGrabber = this.setMarketDataGrabber();
        this.dexClient = this.setDex();
        this.secretKey = this.setSecretKey();
        this.strategy = this.setStrategy();
    }

    startBot(){
        this.setStartBot();
    }

    setStartBot(){
        this.setPrice();
        this.setTimeFrameData();
        this.botStatusUpdate();
        this.buySellListeners();
    }



    //current price
    setPrice(){
        return this.getPrice();
    }

    getPrice(){
        this.marketDataGrabber.sendPrice();
        this.events.on('SingleMarketData', (price: number) => {//SingleMarketObject) => {
            //console.log(price)
            this.price = price;
            this.strategy.buySellLogic(price, this.indicators ,this.sold, this.bought, this.buySellTrigger);
        })

    }
    testPrice(){
        return this.price;
    }



    //market data
    setTimeFrameData(){
        return this.getTimeFrameData();
    }

    getTimeFrameData(){
        let lastTime = this.marketData?.time;

        this.marketDataGrabber.sendTimeFrameData(lastTime!);

        this.events.on('TimeFrameData', (md: MarketDataObject) => {
            console.log(md)
            this.updateIndicators(md);
            this.updateMarketData(md);
            console.log('updated market data: \n' + this.marketData?.time + '\n');
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
        console.log('buy signal')
        this.buySellTrigger = false;
        getBalance('USD')
        .then((bal) =>{
            return this.dexClient(bal, side, this.secretKey, this.pairing);
        })
        .then(()=>{
            console.log('bought')
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
                `lastdatatime: ${this.marketData?.startTime}\n
                price: ${this.price}\n
                volume: ${this.marketData?.volume}\n
                bought: ${this.bought}\n
                sold: ${this.sold}\n
                buyselltrigger : ${this.buySellTrigger}`
            );
        }, 120000);
    }

    

    updateMarketData(md: MarketDataObject){
        console.log('updating market data' );
        this.marketData!.startTime = md.startTime;
        this.marketData!.time = md.time;
        this.marketData!.open = md.open;
        this.marketData!.high = md.high;
        this.marketData!.low = md.low;
        this.marketData!.close = md.close;
        this.marketData!.volume = md.volume;
    }

    updateIndicators(md: MarketDataObject){
        this.indicators = this.strategy.updateIndicators(md, this.indicators);
    }



    setSecretKey():number[]{
        return this.getSecretKey();
    }

    getSecretKey():number[]{
        let secretKeyString = fs.readFileSync(this.secretkeyPath, "utf8");
        const secretKey: SecretKeyObj = JSON.parse(secretKeyString);
        return secretKey.pk
    }

    setEventEmitter(){
        return new EventEmitter();
    }

    setDataClient(){
        return new FtxClient(this.pairing, this.windowResolution);
    }

    setMarketDataGrabber(){
        return new MarketDataGrabber(this.dataClient, this.events);
    }

    setStrategy(){
        const strategy = this.getStrategy();
        return new strategy(this.stopLoss, this.events)
    }

    getStrategy(){
        return new LoadStrategy('simpleema').loadStrategy();
    }

    setDex(){
        return new LoadExchange(this.dex).swapClient();
    }

}

export default CryptoTradingBot