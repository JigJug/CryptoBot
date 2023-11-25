import {
  Percent,
  Token,
  TokenAmount,
  ENDPOINT as _ENDPOINT,
} from '@raydium-io/raydium-sdk';
import {Keypair} from '@solana/web3.js';
import { getWalletTokenAccount } from './Main/DexClients/RaydiumSwaps/RaydiumUtils';


export interface FtxApiObject {
  //ftx get response type
  success: Boolean;
  result: MarketDataObject[] | MarketDataObject | SingleMarketObject;
  error: string;
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
  emaInterval: string;
  cexData: string;
  dex: string;
  stopLoss: number;
  data: null | MarketDataObject;
  strategy: string;
}

export interface HistoricData {}

export interface SecretKeyObj {
  sp: string;
  pk: number[];
}

export interface SingleMarketObject {
  name: string;
  baseCurrency: null;
  quoteCurrency: null;
  quoteVolume24h: number;
  change1h: number;
  change24h: number;
  changeBod: number;
  highLeverageFeeExempt: boolean;
  minProvideSize: number;
  type: string;
  underlying: string;
  enabled: boolean;
  ask: number;
  bid: number;
  last: number;
  postOnly: boolean;
  price: number;
  priceIncrement: number;
  sizeIncrement: number;
  restricted: boolean;
  volumeUsd24h: number;
  largeOrderThreshold: number;
  isEtfMarket: boolean;
}

export interface indicators {
  ema: number;
  rsi: number;
  sma: number;
  macd: number;
}

export interface CexClient {}

export interface PoolList {}

export interface EndPointOptions {}

export interface DataClientHandler {
  processHistoricData: (config: BotConfig) => Promise<MarketDataObject>;
  processPrice: () => Promise<number>;
}

export interface Endpoints {
  price: string;
  candleData: string;
}

export interface BaseStrategy {
  buySellLogic: (
    price: number,
    indicators: indicators,
    sold: boolean,
    bought: boolean,
    buySellTrigger: boolean
  ) => void;
  updateIndicators: (
    md: MarketDataObject,
    indicators: indicators
  ) => indicators;
}


export interface DexSwap {
  swap: (ammount: number, side: string, secretKey: Uint8Array | number[] | null, pairing: string) => Promise<void>
}

export interface RayPoolInfo {
  name: string
  official: RaySinglePoolInfo[]
  unOfficial: RaySinglePoolInfo[]
}

export interface RaySinglePoolInfo     {
  id: string
  baseMint: string
  quoteMint: string
  lpMint: string
  baseDecimals: number,
  quoteDecimals: number,
  lpDecimals: number,
  version: number,
  programId: string
  authority: string
  openOrders: string
  targetOrders: string
  baseVault: string
  quoteVault: string
  withdrawQueue: string
  lpVault: string
  marketVersion: number,
  marketProgramId: string
  marketId: string
  marketAuthority: string
  marketBaseVault: string
  marketQuoteVault: string
  marketBids: string
  marketAsks: string
  marketEventQueue: string
  lookupTableAccount: string
}

export type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>

export type TestTxInputInfo = {
  outputToken: Token
  targetPool: string
  inputTokenAmount: TokenAmount
  slippage: Percent
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}
