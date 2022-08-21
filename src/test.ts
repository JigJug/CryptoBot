import { CryptoTradingBot } from "./CryptoTradingBot";
const fs = require('fs')

let windowResolution: string = '14400'//4h
let pairing: string = 'SRM/USD'
let pairing1: string = pairing.replace('/', '')
let ftxEndpoint: string = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`

let path = 'D:\\CryptoProject\\DataCollector\\MarketData\\SRMUSD14400.json'

let lastData = fs.readFileSync(path, "utf8", (err: Error, data: any)=>{
    if(err){
        console.log(err)
    }
    
    
});

lastData = JSON.parse(lastData)

lastData = lastData[lastData.length - 1]

console.log(lastData.ema)

const NewBot = new CryptoTradingBot(pairing,[],endPoint)

setInterval(()=>{
    console.log(NewBot.testPrice())
}, 15000)