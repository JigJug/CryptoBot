import { FtxGetHistoricMarketData } from "./FtxGetHistoricMarketData";
import { CryptoTradingBot } from "./Main/CryptoTradingBot";
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
                console.log(rt.pairing, rt.windowResolution, marketData)
                console.log('start new bot instance')

                const NewBot = new CryptoTradingBot(
                    rt.pairing,
                    rt.windowResolution,
                    marketData,
                    rt.secretKeyPath,
                    marketData.close,
                    rt.dex
                )
                
                NewBot.startBot();
                console.log('startbotscript starting bot')
            }
            else {
                console.log('no data');
            }
            

        })
        .catch((err) => {
            console.log(err);
        })

    }

}



