import { BotConfig, MarketDataObject } from "../typings";
import { FtxGetHistoricMarketData } from "./FtxGetHistoricMarketData";
import binanceGetHistoricMarketData from "./binancegethistoricdata";

async function getHistoricMarketData(botConfig: BotConfig): Promise<MarketDataObject> {
    if(botConfig.cexData === 'ftx') return FtxGetHistoricMarketData(botConfig); 
    else return binanceGetHistoricMarketData();
}

export default getHistoricMarketData