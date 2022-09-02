import { FtxGetHistoricMarketData } from "./newFtxGetHistoricMarketData";
import { CryptoTradingBot } from "./Main/CryptoTradingBotTestUpdateEvents";
const fs = require('fs')

export class LoadBot{

    constructor(){

    }

    loadBot(){

        let configPAth = 'D:\\CryptoProject\\DataCollector\\config.json'
        let botConfigRaw = fs.readFileSync(configPAth, "utf8", (err: Error, data: any)=>{
            if(err){
                console.log(err)
            }
        });
        let botConfig = JSON.parse(botConfigRaw);

        FtxGetHistoricMarketData(botConfig)
        .then((rt) => {
            if(rt.data != null){
                let marketData = rt.data[rt.data.length - 1]
                console.log(rt.pairing)
                console.log(rt.windowResolution)
                console.log(rt.secretKeyPath)
                console.log(marketData)
                console.log('start new bot instance')
                console.log(marketData.close)
                const NewBot = new CryptoTradingBot(rt.pairing, rt.windowResolution, marketData, rt.secretKeyPath, 0.8954)
                console.log('startbotscript starting bot')
                NewBot.startBot();
            }
            

        })
        .catch((err) => {
            console.log(err);
        })

    }

}



