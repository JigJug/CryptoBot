"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FtxApiGetRequest_1 = require("./FtxApiGetRequest");
var dateTime = new Date();
//let h = addZero(dateTime.getUTCHours());
//let m = addZero(dateTime.getUTCMinutes());
var s = dateTime.getUTCSeconds();
console.log(s);
var windowResolution = '14400'; //4h
var pairing = 'SRM/USD';
var pairing1 = pairing.replace('/', '');
var ftxEndpoint = "https://ftx.com/api";
var endPoint = ftxEndpoint + "/markets/" + pairing;
///trades
var marketData = new FtxApiGetRequest_1.FtxGetHandler(pairing, endPoint);
marketData.lastEntry = false;
function getSinglePrice() {
    marketData.ftxGetMarket()
        .then(function (ret) {
        console.log(ret.result.price);
    })
        .catch(function (err) {
        console.log(err);
    });
}
setInterval(getSinglePrice, 5000);
//getData().then((data)=>{
//    const stordatjs = new StoreDataJson('looks', '14400',data)
//    stordatjs.storeToJson()
//})
