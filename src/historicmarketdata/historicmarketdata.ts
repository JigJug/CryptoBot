import { BotConfig } from "../typings";
import binanceGetHistoricMarketData from "./binancegethistoricdata";

async function getHistoricMarketData(botConfig: BotConfig): Promise<BotConfig> {
    try {
        
    } catch (err) {
        throw err;
    }
    return binanceGetHistoricMarketData(botConfig);
}

export default getHistoricMarketData