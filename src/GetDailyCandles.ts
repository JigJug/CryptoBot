
import { StoreDataJson } from './StoreDataToJson'
const fs = require('fs');
let hourPlusMinute;
let dayMilis = 1000 * 60// * 60 * 24;



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


function addZero(i: any) { 
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function getTimeNow(){
    return new Promise((resolve, reject) => {
        let dateTime = new Date();
        let h = addZero(dateTime.getUTCHours());
        let m = addZero(dateTime.getUTCMinutes());
        let s = addZero(dateTime.getUTCSeconds());
        hourPlusMinute = h + ':' + m;

        console.log(hourPlusMinute)
    
        resolve(hourPlusMinute);

        reject(new Error('Could not get time'));
    })
}


function timePromise(){
    return new Promise<void>((resolve) => {
        let tiInt = setInterval(()=>{
            getTimeNow().then(ckTi => {
                if(ckTi == "06:24"){
                    clearInterval(tiInt);
                    resolve();
                }
            }).catch(err => {console.log(err)})
        },5000)
    })
}

function startDataGrab(){

    console.log('starting datagrab');
    //addDailyCandle();

    setInterval(
        function() {
            console.log('grabbing data')
            //addDailyCandle();
        }, dayMilis
    );

}

//this is our main entry to run the script.
// if youre starting this out first, its a timer returning a promise when it hits 0000. promise gets fulfilled then triggers the actual
//data grabbing.
//data grab gets the daily candle, works out the ema, updates the json file 
timePromise().then(()=>{
    startDataGrab();
})
