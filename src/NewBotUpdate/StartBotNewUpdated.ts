import { FtxGetHistoricMarketData } from "../FtxGetHistoricMarketData";
import { CryptoTradingBot } from "../NewBotUpdate/CryptoTradingBotTestUpdateEvents";

FtxGetHistoricMarketData()
.then((rt) => {

    let marketData = rt.data[rt.data.length - 1]
    const NewBot = new CryptoTradingBot(rt.pairing, rt.windowResolution, marketData, rt.secretKeyPath, 0, 0.6672)

    NewBot.startBot();

    console.log(NewBot.ammountCoin)
    console.log(NewBot.ammountUsdc)
    console.log(NewBot.bought)
    console.log(NewBot.buySellTrigger)
    console.log(NewBot.pairing)
    console.log(NewBot.price)
    console.log(NewBot.secretkeyPath)
    console.log(NewBot.sold)
})
.catch(()=> {console.log('ERROR: Could not start bot')});



