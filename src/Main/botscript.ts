import { setInterval } from "timers";
import { TradingBotConfig, TradingBotDynamicData} from "./CryptoTradingBotNoClass";
import { FtxGetHandler } from "./FtxApiGetRequest";
import { EMA } from "./EMA";
import {StoreDataJson} from "./StoreDataToJson"
import { orcaApiSwapSell } from "../OrcaSwaps/orcaApiSwapRayUsdcSell";
import { orcaApiSwapBuy } from "../OrcaSwaps/orcaApiSwapUsdcRayBuy";
const fs = require('fs')

//************************************************************************************************************************
//SET UP TRADINGBOT 
let windowResolution: string = '60'//4h
let pairing: string = 'RAY/USD'
let pairing1: string = pairing.replace('/', '')
let ftxEndpoint: string = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`
let marketDataEndpoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`
let path = 'D:\\projs\\DataCollector\\MarketData\\RAYUSD60.json'
let data = fs.readFileSync(path, "utf8", (err: Error, data: any)=>{
    if(err){
        console.log(err)
    }
});
let jsonPath = 'D:\\projs\\DataCollector\\MarketData\\'
let Data = JSON.parse(data)
//console.log(Data)
let secretKeyPath = ''
// load everythig from a json config file. done need to explicity declare this stuff in the script
// all data can come from user input.
//assign the user configs
TradingBotConfig.marketDataEndpoint = marketDataEndpoint;
TradingBotConfig.jsonPath = jsonPath;
TradingBotConfig.pairing = pairing;
TradingBotConfig.priceEndPoint = endPoint;
TradingBotConfig.secretkeyPath = secretKeyPath;

//************************************************************************************************************************
//************************************************************************************************************************
//************************************************************************************************************************
//************************************************************************************************************************
//PRICE AND EMA AND ROUTINE CHECKING
TradingBotDynamicData.buySellTrigger = true
TradingBotDynamicData.bought = true
TradingBotDynamicData.sold = false

//check price every 3 seconds
const price = new FtxGetHandler(TradingBotConfig.pairing, TradingBotConfig.priceEndPoint);

setInterval(startPrice, 3000)

function startPrice(){
    fetchPrice()
    .then((price) => {
        TradingBotDynamicData.price = price;
        return 
    })
    .catch((err) => {
        console.log(err);
        return
    })
}

function fetchPrice(){
    return new Promise<number>((resolve, reject) => {
        price.ftxGetMarket()
        .then((ret) => {
            resolve(ret.result.price)
        })
        .catch((err) =>{
            console.log(err);
            reject(err)
        })
    })
}

//4h data
//check the time difference between the last set of 4h data in the marketdata array
//when its above the 4hr limit grab the next set of 4h data from the FTX API 
//calc the ema and update the emaysterday and push the 4h market data with updated ema
const newMdSet = new FtxGetHandler(pairing, marketDataEndpoint);
newMdSet.lastEntry = true

TradingBotDynamicData.marketData = Data;
const newEma = new EMA(70, TradingBotDynamicData.marketData);
console.log(TradingBotDynamicData.marketData[Data.length - 1])
TradingBotDynamicData.emaYesterday = Data[Data.length - 1].ema
let fourHour = 1000 * 60;
const storeJson = new StoreDataJson(
    TradingBotConfig.jsonPath,
    TradingBotConfig.pairing.replace('/', ''),
    '60'
);
    
setInterval(startFourHourData, 30000)

function startFourHourData(){
    fetchFourHourData(TradingBotDynamicData.emaYesterday, fourHour)
    .catch((err) => {
        console.log(err)
    })
}

function fetchFourHourData(emaYesterday: number, fourHour: number){
    return new Promise<void>((resolve, reject) => {
        let time = new Date();
        let timeMills = time.getTime();
        let lastIndex = TradingBotDynamicData.marketData.length - 1
        let timeDiff = timeMills - TradingBotDynamicData.marketData[lastIndex].time
        
        if(timeDiff > fourHour){
            newMdSet.ftxGetMarket()
            .then((md) => {
                md.ema = newEma.emaCalc(md.close, emaYesterday);
                TradingBotDynamicData.emaYesterday = md.ema;
                TradingBotDynamicData.marketData.push(md);
                storeJson.storeToJson(TradingBotDynamicData.marketData);
                resolve()
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            });

        }

    })

}

TradingBotDynamicData.ammountCoin = 200
TradingBotDynamicData.ammountUsdc = 200
setInterval(()=>{
    if(TradingBotDynamicData.price > TradingBotDynamicData.emaYesterday){
        if(TradingBotDynamicData.buySellTrigger && TradingBotDynamicData.sold){
            TradingBotDynamicData.buySellTrigger = false
            orcaApiSwapBuy(TradingBotConfig.secretkeyPath, TradingBotDynamicData.ammountUsdc)
            .then((ammount: number)=>{
                TradingBotDynamicData.ammountCoin = ammount
                TradingBotDynamicData.buySellTrigger = true
                TradingBotDynamicData.bought = true
                TradingBotDynamicData.sold = false
                
            })
            .catch((err) => {
                console.log(err);
                TradingBotDynamicData.buySellTrigger = true
                TradingBotDynamicData.bought = true
                TradingBotDynamicData.sold = false
            });
        }
    }
},3000)


setInterval(()=>{
    if(TradingBotDynamicData.price < TradingBotDynamicData.emaYesterday){
        if(TradingBotDynamicData.buySellTrigger && TradingBotDynamicData.bought){
            TradingBotDynamicData.buySellTrigger = false
            orcaApiSwapSell(TradingBotConfig.secretkeyPath, TradingBotDynamicData.ammountUsdc)
            .then((ammount: number)=>{
                TradingBotDynamicData.ammountUsdc = ammount
                TradingBotDynamicData.buySellTrigger = true
                TradingBotDynamicData.sold = true
                TradingBotDynamicData.bought = false
            })
            .catch((err) => {
                console.log(err);
                TradingBotDynamicData.buySellTrigger = true
                TradingBotDynamicData.sold = true
                TradingBotDynamicData.bought = false
            });
        }
    }
},3000)







//test everything
setInterval(() => {
    console.log("TradingBotDynamicData.price " + TradingBotDynamicData.price)
    //console.log('\n')
    console.log("TradingBotDynamicData.emaYesterday " + TradingBotDynamicData.emaYesterday)
    //console.log('\n')
    console.log("TradingBotDynamicData.buySellTrigger " + TradingBotDynamicData.buySellTrigger)
    //console.log('\n')
    console.log("TradingBotDynamicData.bought " + TradingBotDynamicData.bought)
    //console.log('\n')
    console.log("TradingBotDynamicData.sold " + TradingBotDynamicData.sold)
    console.log('\n')
}, 10000)





