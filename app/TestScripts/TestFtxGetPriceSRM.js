"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FtxApiGetRequest_1 = require("../Main/FtxApiGetRequest");
let dateTime = new Date();
//let h = addZero(dateTime.getUTCHours());
//let m = addZero(dateTime.getUTCMinutes());
let s = dateTime.getUTCSeconds();
console.log(s);
let windowResolution = '14400'; //4h
let pairing = 'SRM/USD';
let pairing1 = pairing.replace('/', '');
let ftxEndpoint = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`;
///trades
const marketData = new FtxApiGetRequest_1.FtxGetHandler(pairing, endPoint);
marketData.lastEntry = false;
function getSinglePrice() {
    marketData.ftxGetMarket()
        .then((ret) => {
        console.log(ret.result.price);
    })
        .catch((err) => {
        console.log(err);
    });
}
setInterval(getSinglePrice, 5000);
//getData().then((data)=>{
//    const stordatjs = new StoreDataJson('looks', '14400',data)
//    stordatjs.storeToJson()
//})
