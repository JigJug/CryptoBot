import { HttpsGetRequest } from "../Main/Utils/HttpsGetRequest";
import { BotConfig } from "../typings";

function mapBinanceCandleData(data: any) {
    return data.map((v : any) => {
        return {
            stratTime: v[0],
            time: v[6],
            open: v[1],
            high: v[2],
            low: v[3],
            close: v[4],
            volume: v[5],
        }
    })
}

async function binanceGetHistoricMarketData(botConfig: BotConfig) {
    const baseUrl = 'https://api.binance.com/api/v3/';
    const endPointCd = 'klines?symbol=SOLUSDT&interval=4h&limit=2';
    const endPointPing = 'ping'
    const t = 'time'
    const req = new HttpsGetRequest();
    const historicCandleData = await req.httpsGet(`${baseUrl}${endPointCd}`);
    const data = mapBinanceCandleData(JSON.parse(historicCandleData));
    
    return botConfig
}

binanceGetHistoricMarketData({})

export default binanceGetHistoricMarketData