export interface FtxApiObject {//ftx get response type
    success: Boolean;
    result: [];
}

export interface MarketDataObject {
    startTime: string;
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ema: number;
}

export interface BotConfig {
    pairing: string;
    windowResolution: string;
    secretKeyPath: string;
    emaInterval: string;
    cexData: string;
    data: null | MarketDataObject[]
}

export interface HistoricData {

}
