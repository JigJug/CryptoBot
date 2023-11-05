import * as fs from 'fs';
import { BotConfig } from './typings';
import { FatBotController } from './fatbotcontroller';
import {EventEmitter} from 'events';
import { MarketDataObject } from './typings';
import { CryptoTradingBot } from './Main';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 8080;//8080;

type SelectBot = {[key: string]: {[key:string]: CryptoTradingBot}}

const events = new EventEmitter();

const botController = new FatBotController();













// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.error);















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

app.post('/botdeets', async (req, res, next) => {

  const del = () => {
    return new Promise(res => setTimeout(res, 2000))
  }
  
  const id = req.body.body.id;
  const pubkey = req.body.body.pubkey;

  if(!(pubkey in botController.bots)) {
    res.send('no data')
    return next();
  }

  const curBot = bot(id, pubkey)

  //const {usdc, sol} = await curBot.checkBalance();

  const response = {
    time: curBot.marketData?.time,
    price: curBot.price,
    ema: curBot.indicators.ema,
    volume: curBot.marketData?.volume,
    bought: `${curBot.bought}`,
    sold: `${curBot.sold}`,
    //usdc: `${usdc.toFixed(5)}`,
    //sol: `${sol.toFixed(5)}`
  }

  res.send(response)
  return next();
    
})

app.post('/loadbot', async (req, res, next) => {
  const body = req.body.body;
  //res.set('Access-Control-Allow-Origin', '*');
  const id = await botController.loadbot(req.body.body.config, req.body.body.pubkey, events);
  //console.log(bot(id, body.pubkey).keyPair?.publicKey.toString())
  console.log(botController.bots)
  res.send("CyQBLYTw1o1y38trQ1aYEBUAaRc5m26GTQHzscNwgqiB")//bot(id, body.pubkey).keyPair?.publicKey.toString());
  bot(id, body.pubkey).startBot();
  next();
})

app.post('/startbot', async (req, res, next) => {
  const body = req.body.body;
  bot(body.id, body.pubkey).startBot()
  res.send('bot started');
  next();
})

app.get('/maxtest', async (req, res, next) => {
  res.send('hi max youre a cunt')
  next();
})

app.post('/maxtestpost', async (req, res, next) => {
  console.log(req.body)
  res.send('hi cunt');
  next();
})
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})