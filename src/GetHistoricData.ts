//this script grabs the historic data of a given token and adds indicator information to store to json.
// this should be ran once when adding a new token 

import { EMA } from './EMA'
import {StoreDataJson} from "./StoreDataToJson"
const readline = require('readline');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//this is for SRM ONLY EMA!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getEMA = new EMA(30)

let priceToday
let emaYesterday
let ema

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('ENTER TICKER AND PAIRING... ', (answer) => {
  // TODO: Log the answer in a database
  const getData = new StoreDataJson(answer, '1d', 500)
  console.log('doing ema')
  getData.getCandles().then(data => {

    //run through and add in the ema
    for(const candleEntries in data){

      if(data[candleEntries]['openTime'] == 1599609600000){
        emaYesterday = 2.1873
        data[candleEntries].ema = emaYesterday
        

      }else if(data[candleEntries]['openTime'] > 1599609600000){
        priceToday = data[candleEntries]['close']
        let a = getEMA.emaCalc(priceToday, emaYesterday)
        console.log('logging ema::: ', a)
        data[candleEntries].ema = a
        emaYesterday = a
      }

    }

    getData.storeToJson(data)
  }).catch(error => {
    console.log(error)
  })
  
  console.log(`You have selected ticker ${answer} with`);

  rl.close();
});