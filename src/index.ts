import * as fs from 'fs';
import { BotConfig } from './typings';
import { FatBotController } from './fatbotcontroller';
import {EventEmitter} from 'events';
import { MarketDataObject } from './typings';
import { CryptoTradingBot } from './Main';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const port = 8080;

type SelectBot = {[key: string]: {[key:string]: CryptoTradingBot}}

const events = new EventEmitter();

const botController = new FatBotController();

function bot(id: string, pubkey: string) {
  return botController.bots[pubkey][id];
}

/*function getBotConfigs(): BotConfig {
  let configPAth = 'D:\\CryptoProject\\BotConfigs\\config.json'
  let botConfigRaw = fs.readFileSync(configPAth, "utf8");
  return JSON.parse(botConfigRaw);
}*/

//events.on('newbot', (config: BotConfig, pubkey: string) => {
//  botController.startBot(config, pubkey, events);
//})

function getPrice(){

  events.on('SingleMarketData', (price: number, id: string, pubkey: string) => {//SingleMarketObject) => {
    const cb = bot(id, pubkey);
    cb.price = price
    cb.strategy.buySellLogic(
      price,
      cb.indicators,
      cb.sold,
      cb.bought,
      cb.buySellTrigger
    );
  })
}


function getTimeFrameData(){
  events.on('TimeFrameData', (md: MarketDataObject, id: string, pubkey: string) => {
    const cb = bot(id, pubkey);
    console.log(md)
    cb.updateIndicators(md);
    cb.updateMarketData(md);
    console.log('updated market data: \n' + cb.marketData?.time + '\n');
    console.log('ema:: ',  cb.indicators.ema);
  })
}


//buying and selling
function buySellListeners(){

  events.on('Buy', (buy: boolean, id, pubkey: string) => {
    const cb = bot(id, pubkey);
    console.log('recieved buy signal');
    if(buy && cb.buySellTrigger && cb.sold){
      cb.getBuy();
    }
  });

  events.on('Sell', (sell: boolean, id, pubkey: string) => {
    const cb = bot(id, pubkey);
    console.log('recieved sell signal');
    if(sell && cb.buySellTrigger && cb.bought){
      cb.getSell();
    }
  })

}

export function listeners() {
  getPrice();
  getTimeFrameData();
  buySellListeners();
}




listeners();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res, next) => {
  
  //res.set('Access-Control-Allow-Origin', '*');
  res.send('HELLO FROM BOT GET REQUEST')
    
})

app.post('/loadbot', async (req, res, next) => {
  console.log(req.body)
  //res.set('Access-Control-Allow-Origin', '*');
  const id = await botController.loadbot(req.body.body.config, req.body.body.pubkey, events);
  console.log(bot(id, req.body.body.pubkey).keyPair?.publicKey.toString())
  res.send(bot(id, req.body.body.pubkey).keyPair?.publicKey.toString());
  
  //console.log(req.body)
  next();
})

app.post('/startbot', async (req, res, next) => {
  console.log(req.body)
  bot(req.body.body.id, req.body.body.pubkey).startBot()
  res.send('bot started');

  console.log(req.body)
  next();
})
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})