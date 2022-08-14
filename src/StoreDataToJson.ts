//binance changed their policy on who has acces to api data so need to find something better
import fs = require('fs')

/*
This is a class which retrieves data from binance api (market data such as price and candle data) and can store the data to JSON file

This can be used in a umber of ways for example:
  - a script to collect daily candles over a period of up to 500 days weeks or months, thi data can be then used or updated to a database.
  - a script to collect minute to daily chart updates or prices for a trading bot.

StoreDataJason accepts 3 params: ticker, interval and limit
  - ticker is the pairing eg. BTCUSDT
  - interval time interval eg 1m 4h 1d
  - limit is the number of data points returned when making candle data requests max: 500

Methods:
  Price: gets current market price of ticker. Max requests 100 per second?
  getCandles: returns candles according to the params
  stores the candle data to local JSON file
*/


export class StoreDataJson {
  ticker: string
  interval: string
  data 

  constructor(
      ticker: string,
      interval: string,
      data: any
  ){
      this.ticker = ticker
      this.interval = interval
      this.data = data
  }



  storeToJson(){

    let inte = this.interval
    let tick = this.ticker
    let fileName = `${tick}${inte}.json`

    function storeToJSON(data: any){

      data = JSON.stringify(data, null, 2);

      fs.writeFile(fileName, data, (err) => {
          if (err) throw err;
          console.log('Data written to file');
      });
    }

    return storeToJSON(this.data)
  }
}