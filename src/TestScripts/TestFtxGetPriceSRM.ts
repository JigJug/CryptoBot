import {FtxGetHandler} from '../Main/FtxApiGetRequest'


let dateTime = new Date();
//let h = addZero(dateTime.getUTCHours());
//let m = addZero(dateTime.getUTCMinutes());
let s = dateTime.getUTCSeconds();

console.log(s)

let windowResolution: string = '14400'//4h
let pairing: string = 'SRM/USD'
let pairing1: string = pairing.replace('/', '')
let ftxEndpoint: string = `https://ftx.com/api`;
let endPoint = `${ftxEndpoint}/markets/${pairing}`
///trades
const marketData = new FtxGetHandler(pairing, endPoint);

marketData.lastEntry = false


function getSinglePrice(){
    marketData.ftxGetMarket()
    .then((ret) => {
        console.log(ret.result.price)
    })
    .catch((err) =>{
        console.log(err)
    })
}

setInterval(getSinglePrice, 5000)

//getData().then((data)=>{
//    const stordatjs = new StoreDataJson('looks', '14400',data)
//    stordatjs.storeToJson()
//})




  
