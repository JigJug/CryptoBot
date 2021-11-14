"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEma30 = void 0;
var EMA_1 = require("./EMA");
function addEma30(data, oneCaDat) {
    var getEMA = new EMA_1.EMA(30);
    //turn the json data into the array of objects it should be 
    var arrayOfObjects = JSON.parse(data);
    //get the last obj entry number of the array
    var last = arrayOfObjects.length - 2;
    var lastObj = arrayOfObjects[last];
    var emaYesterday = lastObj['ema'];
    var priceToday = oneCaDat[0]['close'];
    var a = getEMA.emaCalc(priceToday, emaYesterday);
    console.log('logging ema::: ', a);
    oneCaDat[0].ema = a;
    var obj = oneCaDat[0];
    arrayOfObjects.push(obj);
    console.log('Added: ', obj);
    return arrayOfObjects;
}
exports.addEma30 = addEma30;
