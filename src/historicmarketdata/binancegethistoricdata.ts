import { HttpsGetRequest } from "../Main/Utils/HttpsGetRequest";
import { BotConfig, MarketDataObject } from "../typings";
import calcEmaStoreData from "../Main/DataClients/handlers/calcema";

function mapBinanceCandleData(data: any): MarketDataObject[] {
    return data.map((v : any) => {
        return {
            stratTime: v[0],
            time: v[6],
            open: parseFloat(v[1]),
            high: parseFloat(v[2]),
            low: parseFloat(v[3]),
            close: parseFloat(v[4]),
            volume: parseFloat(v[5]),
        }
    })
}

async function binanceGetHistoricMarketData(options?: {limit: string}) {

    const limit = (() => {
        return options? `&limit=${options.limit}` : '';
    })();

    const baseUrl = 'https://api.binance.com/api/v3/';
    const endPointCd = 'klines?symbol=SOLUSDT&interval=4h';//&limit=20';

    const req = new HttpsGetRequest();

    const historicCandleData = await req.httpsGet(`${baseUrl}${endPointCd}${limit}`);

    const data = mapBinanceCandleData(JSON.parse(historicCandleData));
    if(options)const dataWithEma: MarketDataObject[] = await calcEmaStoreData(data, 70, 'SOLUSDT', '300');
    const md = dataWithEma.reverse();

    return options? md[0] : md[1]

}


export default binanceGetHistoricMarketData