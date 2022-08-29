export type FtxApiObject = {//ftx get response type
    success: Boolean;
    result: [];
}

export type MarketDataObject = {
    startTime: string;
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ema: number;
}