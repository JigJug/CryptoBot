import { FtxGetHistoricMarketData } from "../FtxGetHistoricMarketData";
import { CryptoTradingBot } from "../NewBotUpdate/CryptoTradingBotTestUpdateEvents";
let x = ''
FtxGetHistoricMarketData()
.then((rt) => {

    let marketData = rt.data[rt.data.length - 1]
    console.log(rt.pairing)
    console.log(rt.windowResolution)
    console.log(rt.secretKeyPath)
    console.log(marketData)
    console.log('start new bot instance')
    console.log(marketData.close)
    const NewBot = new CryptoTradingBot(rt.pairing, rt.windowResolution, marketData, rt.secretKeyPath, 0, 0.6749)
    console.log('startbotscript starting bot')
    NewBot.startBot();


})
.catch((err)=> {console.log('ERROR: Could not start bot' + err)});



