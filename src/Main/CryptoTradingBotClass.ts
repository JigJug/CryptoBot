import { LoadExchange } from './DexClients/ExchangeLoader'
import { getBalance } from './Utils/CheckWalletBalances'
import { BotConfig, indicators, MarketDataObject} from '../typings'
import { Strategy } from './Strategy/LoadStrategy'
import { EventEmitter } from 'events';
import { MarketDataController } from './marketdata'
import { DataClient } from './DataClients/dataclient'
import * as dotenv from "dotenv";
dotenv.config();

class CryptoTradingBot {
    id
    pubkey
    pairing
    windowResolution
    marketData
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
    marketDataController
    dexClient
    strategy
    //keyPair: Keypair | null
    secretKey: number[] | Uint8Array | null | undefined
    
    constructor(
        id: string,
        pubkey: string,
        botConfig: BotConfig,
        indicators: indicators,
        dataClient: DataClient,
        events: EventEmitter,
        //keyPair: Keypair,
    ){
        this.id = id;
        this.pubkey = pubkey;
        this.pairing = botConfig.pairing;
        this.windowResolution = botConfig.windowResolution;
        this.marketData = botConfig.data;
        this.price = botConfig.data?.close;
        this.dex = botConfig.dex;
        this.stopLoss = botConfig.stopLoss;
        this.indicators = indicators;
        
        this.buySellTrigger = true;
        this.bought = false;
        this.sold = false;

        (async () => {
          const amm = await getBalance('');
          if(amm < 3) {
            this.bought = true
            this.sold = false
          } else {
            this.bought = false
            this.sold = true
          }
        })();

        this.coin = 'SOL';
        //load the data and dex clients, emitters, secretkey and strategy
        this.events = events;
        this.dataClient = dataClient;
        this.marketDataController = this.setMarketDataController();
        this.dexClient = this.setDex();
        this.strategy = this.setStrategy();
        //this.keyPair = keyPair
        this.secretKey = this.setSecretKeyDev();
        console.log(this.secretKey);
        
    }

    setMarketDataController(){
      return new MarketDataController(this.dataClient, this.events, this.id, this.pubkey);
  }

  setStrategy(){
      return this.getStrategy();
  }

  getStrategy(){
      return new Strategy('simpleema').loadStrategy(
        this.stopLoss,
        this.events,
        this.id,
        this.pubkey
      );
  }

  setDex(){
      return new LoadExchange(this.dex).swapClient();
  }

    startBot(){
        this.setStartBot();
    }

    setStartBot(){
        this.setPrice();
        this.setTimeFrameData();
        this.botStatusUpdate();
    }

    //current price
    setPrice(){
        return this.getPrice();
    }

    getPrice(){
        this.marketDataController.sendPrice();
    }

    //market data
    setTimeFrameData(){
        return this.getTimeFrameData();
    }

    getTimeFrameData(){
        let lastTime = this.marketData?.time;
        this.marketDataController.sendTimeFrameData(lastTime!);
    }

    getBuy(){
        return this.buy('buy');
    }
    
    buy(side: string){
        console.log('buy signal')
        this.buySellTrigger = false;
        getBalance('USD')
        .then((bal) =>{
            return this.dexClient(bal, side, this.secretKey!, this.pairing);
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
        /*if(!this.bought && !this.sold) {
            this.sold = true;
            return
        }*/
        this.buySellTrigger = false;
        getBalance(this.coin)
        .then((bal) => {
            return this.dexClient(bal, side, this.secretKey!, this.pairing);
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

    setSecretKeyDev(){
        return this.getSecretKeyDev();
    }

    getSecretKeyDev() {
        const key = process.env.SECRET_KEY;
        return key?.split(',').map(v => parseInt(v));
        //let secretKeyString = fs.readFileSync(this.secretKeyPath, "utf8");
        //const secretKey: SecretKeyObj = JSON.parse(secretKeyString);
        //return secretKey.pk;
    }

    stopBot() {
        this.marketDataController.clearIntervals();
    }

    async checkBalance() {
        const usdc = await getBalance('');
        await (() => new Promise(res => setTimeout(res, 1000)))();
        const sol = await getBalance(this.coin);
        return {usdc, sol}
    }

}

export default CryptoTradingBot