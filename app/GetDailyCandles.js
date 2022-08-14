"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var hourPlusMinute;
var dayMilis = 1000 * 60; // * 60 * 24;
/*function addDailyCandle(){
    fs.readFile('SRMUSDT1d.json', 'utf-8', (err: Error, data:void) => {
        if (err) throw err
        const grabData = new StoreDataJson("SRMUSDT", "1d", 1);
        grabData.getCandles().then(oneCaDat => {
            let arrayOfObjects = addEma30(data, oneCaDat)
            grabData.storeToJson(arrayOfObjects);
        }).catch(error => {
            console.log(error);
        })
    })
}*/
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getTimeNow() {
    return new Promise(function (resolve, reject) {
        var dateTime = new Date();
        var h = addZero(dateTime.getUTCHours());
        var m = addZero(dateTime.getUTCMinutes());
        var s = addZero(dateTime.getUTCSeconds());
        hourPlusMinute = h + ':' + m;
        console.log(hourPlusMinute);
        resolve(hourPlusMinute);
        reject(new Error('Could not get time'));
    });
}
function timePromise() {
    return new Promise(function (resolve) {
        var tiInt = setInterval(function () {
            getTimeNow().then(function (ckTi) {
                if (ckTi == "06:24") {
                    clearInterval(tiInt);
                    resolve();
                }
            }).catch(function (err) { console.log(err); });
        }, 5000);
    });
}
function startDataGrab() {
    console.log('starting datagrab');
    //addDailyCandle();
    setInterval(function () {
        console.log('grabbing data');
        //addDailyCandle();
    }, dayMilis);
}
//this is our main entry to run the script.
// if youre starting this out first, its a timer returning a promise when it hits 0000. promise gets fulfilled then triggers the actual
//data grabbing.
//data grab gets the daily candle, works out the ema, updates the json file 
timePromise().then(function () {
    startDataGrab();
});
