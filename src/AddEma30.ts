import { EMA } from './EMA'

export function addEma30(data, oneCaDat){
    const getEMA = new EMA(30)
    //turn the json data into the array of objects it should be 
    let arrayOfObjects = JSON.parse(data)
    //get the last obj entry number of the array
    let last: number = arrayOfObjects.length - 2
    let lastObj = arrayOfObjects[last]
    let emaYesterday = lastObj['ema']
    let priceToday = oneCaDat[0]['close']
    let a = getEMA.emaCalc(priceToday, emaYesterday)
    console.log('logging ema::: ', a)
    oneCaDat[0].ema = a
    let obj = oneCaDat[0]
    arrayOfObjects.push(obj);
    console.log('Added: ', obj);
    return arrayOfObjects
}