import { CryptoTradingBot } from "./CryptoTradingBot";
const fs = require('fs')

let windowResolution: string = '14400'//4h
let pairing: string = 'RAY/USD'
let pairing1: string = pairing.replace('/', '')
let ftxEndpoint: string = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`

let marketDataEndpoint = `${ftxEndpoint}/markets/${pairing}/candles?resolution=${windowResolution}`

let jsonpath = '/home/pi/Documents/botapp/DataCollector/MarketData/'
let datapath = '/home/pi/Documents/botapp/DataCollector/MarketData/RAYUSD14400.json'

let data = fs.readFileSync(datapath, "utf8", (err: Error, data: any)=>{
    if(err){
        console.log(err)
    }
});
let Data = JSON.parse(data)

let secretKeyPath = '/home/pi/Documents/botapp/et/et.json'

const NewBot = new CryptoTradingBot(pairing, Data, endPoint, 0.70, marketDataEndpoint, jsonpath, secretKeyPath, 9)

//NewBot.getFourHourData();
//NewBot.getPrice();

console.log(NewBot.ammountCoin)
console.log(NewBot.ammountUsdc)
console.log(NewBot.bought)
console.log(NewBot.buySellTrigger)
console.log(NewBot.emaYesterday)
console.log(NewBot.jsonPath)
console.log(NewBot.marketDataEndpoint)
console.log(NewBot.pairing)
console.log(NewBot.price)
console.log(NewBot.priceEndPoint)
console.log(NewBot.secretkeyPath)
console.log(NewBot.sold)

NewBot.startBot();


