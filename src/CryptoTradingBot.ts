import { EMA } from './EMA'
import {FtxGetHandler} from './FtxApiGetRequest'
import { orcaApiSwap } from './orcaApiSwap'
import { StoreDataJson } from './StoreDataToJson'
const fs = require('fs')


export class CryptoTradingBot {
    pairing
    marketData
    priceEndPoint
    price
    emaYesterday
    marketDataEndpoint
    jsonPath
    buySellTrigger
    secretkeyPath
    bought
    sold

    getp
    getfh
    
    constructor(
        pairing: string,
        marketData: any,
        priceEndPoint: string,
        price: number,
        marketDataEndpoint: string,
        jsonPath: string,
        secretkeyPath: string
    ){
        this.pairing = pairing
        this.marketData = marketData
        this.priceEndPoint = priceEndPoint
        this.price = price
        this.emaYesterday = this.marketData[this.marketData.length - 1].ema
        this.marketDataEndpoint = marketDataEndpoint
        this.jsonPath = jsonPath
        this.buySellTrigger = true
        this.secretkeyPath = secretkeyPath
        this.bought = false
        this.sold = true

        this.getp = this.getPrice();
        this.getfh = this.getFourHourData();

    }

    getPrice(){
        return this.setPrice();
    }

    setPrice(){
        const price = new FtxGetHandler(this.pairing, this.priceEndPoint);
        setInterval(() => {
            price.ftxGetMarket()
            .then((ret) => {
                this.price = ret.result.price
            })
            .catch((err) =>{
                console.log(err);
            })
        }, 5000);
    }
    testPrice(){
        return this.price;
    }


    getFourHourData(){
        return this.setFourHourData();
    }
    setFourHourData(){
        if(this.emaYesterday = undefined){
            this.emaYesterday = this.marketData[this.marketData.length - 1].ema
        }
        const newMdSet = new FtxGetHandler(this.pairing, this.marketDataEndpoint);
        newMdSet.lastEntry = true
        const newEma = new EMA(70, this.marketData);

        let time = new Date();
        //let timeMills = time.getTime();
        let fourHour = 1000 * 60 * 60 * 4;

        setInterval(() => {
            let timeMills = time.getTime();
            let lastIndex = this.marketData.length - 1
            if(timeMills - this.marketData[lastIndex].time > fourHour){

                newMdSet.ftxGetMarket()
                .then((md) => {

                    md.ema = newEma.emaCalc(md.close, this.emaYesterday);
                    this.emaYesterday = md.ema;
                    this.marketData.push(md);

                    let storeJson = new StoreDataJson(
                        this.jsonPath,
                        this.pairing.replace('/', ''),
                        '14400',
                        this.marketData
                    );
                    storeJson.storeToJson();
                })
                .catch((err) => {
                    console.log(err)
                });

            }
        },60000)
    }

    readFile(){
        fs.readFileSync('', "utf8", (err: Error, data: any)=>{
            if(err){
                console.log(err)
            }
        });
    }

    buy(){
        
        let orcaApi = orcaApiSwap(this.secretkeyPath, 'SRM', 'USDC')
        while(true){
            if(this.price > this.emaYesterday){
                if(this.buySellTrigger && this.sold){
                    this.buySellTrigger = false
                    

                }
            }
        }
    }



}