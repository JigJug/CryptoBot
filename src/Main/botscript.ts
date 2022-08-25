import { setInterval } from "timers";
import { TradingBotConfig, TradingBotDynamicData, TradingBotGetters } from "./CryptoTradingBotNoClass";
const fs = require('fs')

//************************************************************************************************************************
//SET UP TRADINGBOT 
let windowResolution: string = '14400'//4h
let pairing: string = 'RAY/USD'
let pairing1: string = pairing.replace('/', '')
let ftxEndpoint: string = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`
let marketDataEndpoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`
let path = 'D:\\projs\\DataCollector\\MarketData\\RAYUSD14400.json'
let data = fs.readFileSync(path, "utf8", (err: Error, data: any)=>{
    if(err){
        console.log(err)
    }
});
let jsonPath = 'D:\\projs\\DataCollector\\MarketData\\'
let Data = JSON.parse(data)
console.log(Data)
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

//check price every 3 seconds
function startPrice(){
    TradingBotGetters.getPrice(TradingBotConfig.pairing, TradingBotConfig.priceEndPoint)
    .then((price) => {
        TradingBotDynamicData.price = price;
        return 
    })
    .catch((err) => {
        console.log(err);
        return
    })
}
setInterval(startPrice, 3000)

//4h data
//check the time difference between the last set of 4h data in the marketdata array
//when its above the 4hr limit grab the next set of 4h data from the FTX API 
//calc the ema and update the emaysterday and push the 4h market data with updated ema
TradingBotDynamicData.marketData = Data;
console.log(TradingBotDynamicData.marketData[Data.length - 1])
TradingBotDynamicData.emaYesterday = Data[Data.length - 1].ema

    
setInterval(() => {


}, 60000)

function startFourHour(){
    let time = new Date();
    let timeMills = time.getTime();
    let lastIndex = TradingBotDynamicData.marketData.length - 1
    let timeDiff = timeMills - TradingBotDynamicData.marketData[lastIndex].time
}









//test everything
setInterval(() => {
    console.log("TradingBotDynamicData.price " + TradingBotDynamicData.price)
    console.log('\n')
}, 10000)
