"use strict";
//this script grabs the historic data of a given token and adds indicator information to store to json.
// this should be ran once when adding a new token 
Object.defineProperty(exports, "__esModule", { value: true });
var EMA_1 = require("./EMA");
var StoreDataToJson_1 = require("./StoreDataToJson");
var readline = require('readline');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//this is for SRM ONLY EMA!!!!!!!!!!!!!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var getEMA = new EMA_1.EMA(30);
var priceToday;
var emaYesterday;
var ema;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('ENTER TICKER AND PAIRING... ', function (answer) {
    // TODO: Log the answer in a database
    var getData = new StoreDataToJson_1.StoreDataJson(answer, '1d', 500);
    console.log('doing ema');
    getData.getCandles().then(function (data) {
        //run through and add in the ema
        for (var candleEntries in data) {
            if (data[candleEntries]['openTime'] == 1599609600000) {
                emaYesterday = 2.1873;
                data[candleEntries].ema = emaYesterday;
            }
            else if (data[candleEntries]['openTime'] > 1599609600000) {
                priceToday = data[candleEntries]['close'];
                var a = getEMA.emaCalc(priceToday, emaYesterday);
                console.log('logging ema::: ', a);
                data[candleEntries].ema = a;
                emaYesterday = a;
            }
        }
        getData.storeToJson(data);
    }).catch(function (error) {
        console.log(error);
    });
    console.log("You have selected ticker " + answer + " with");
    rl.close();
});
