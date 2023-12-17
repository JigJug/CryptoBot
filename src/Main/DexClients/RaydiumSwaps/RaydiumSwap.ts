import assert from 'assert';

import {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  Percent,
  Token,
  TokenAmount,
  buildSimpleTransaction,
  InnerSimpleV0Transaction,
  SPL_ACCOUNT_LAYOUT,
  TOKEN_PROGRAM_ID,
  TokenAccount,
  ENDPOINT as _ENDPOINT,
  Currency,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  TxVersion,
  LiquidityPoolKeysV4,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  Keypair,
  PublicKey,
  SendOptions,
  Signer,
  Transaction,
  VersionedTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { RaydiumPools } from "./RaydiumPools";

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  outputToken: Token
  targetPool: string
  inputTokenAmount: TokenAmount
  slippage: Percent
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

const connection = new Connection(
  //"https://solana-api.projectserum.com",
  clusterApiUrl("mainnet-beta"),
  "confirmed"
);

const ENDPOINT = _ENDPOINT;

const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;

const makeTxVersion = TxVersion.V0; // LEGACY

const addLookupTableInfo = LOOKUP_TABLE_CACHE // only mainnet. other = undefined

async function sendTx(
  connection: Connection,
  payer: Keypair | Signer,
  txs: (VersionedTransaction | Transaction)[],
  options?: SendOptions
): Promise<string[]> {
  const txids: string[] = [];
  for (const iTx of txs) {
    if (iTx instanceof VersionedTransaction) {
      iTx.sign([payer]);
      txids.push(await connection.sendTransaction(iTx, options));
    } else {
      txids.push(await connection.sendTransaction(iTx, [payer], options));
    }
  }
  return txids;
}

async function getWalletTokenAccount(connection: Connection, wallet: PublicKey): Promise<TokenAccount[]> {
  const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet, {
    programId: TOKEN_PROGRAM_ID,
  });
  return walletTokenAccount.value.map((i) => ({
    pubkey: i.pubkey,
    programId: i.account.owner,
    accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
  }));
}

async function buildAndSendTx(wallet: Keypair, innerSimpleV0Transaction: InnerSimpleV0Transaction[], options?: SendOptions) {
  const willSendTx = await buildSimpleTransaction({
    connection,
    makeTxVersion,
    payer: wallet.publicKey,
    innerTransactions: innerSimpleV0Transaction,
    addLookupTableInfo: addLookupTableInfo,
  })

  return await sendTx(connection, wallet, willSendTx, options)
}

/**
 * step 1: coumpute amount out
 * step 2: create instructions by SDK function
 * step 3: compose instructions to several transactions
 * step 4: send transactions
 */
async function swapOnlyAmm(wallet: Keypair, input: TestTxInputInfo, poolKeys: LiquidityPoolKeysV4) {

  // -------- step 1: coumpute amount out --------
  const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: input.inputTokenAmount,
    currencyOut: input.outputToken,
    slippage: input.slippage,
  })

  // -------- step 2: create instructions by SDK function --------
  const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      tokenAccounts: input.walletTokenAccounts,
      owner: input.wallet.publicKey,
    },
    amountIn: input.inputTokenAmount,
    amountOut: minAmountOut,
    fixedSide: 'in',
    makeTxVersion,
  })

  console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed())

  return { txids: await buildAndSendTx(wallet, innerTransactions) }
}

function delay() {
  return new Promise(res => {
    setTimeout(res, 500)
  })
}

async function checkTransactionError(startTime: number, signature: string) {
  let newtime = new Date().getTime();
  let tdiff = newtime - startTime;
  if (tdiff > 30000) {
    throw new Error("tx check timeout")
  }
  await delay()
  const status = await connection.getSignatureStatus(signature);

  if (status.value?.confirmationStatus == "confirmed") {
    console.log(status)
    if (status.value?.err) {
      throw new Error("tx failed")
    } else {
      return
    }
  }
  checkTransactionError(startTime, signature);
}

function checkTx(signature: string) {
  let startTime = new Date().getTime();
  return checkTransactionError(startTime, signature);
}

export async function raydiumApiSwap(
  ammount: number,
  side: string,
  secretKey: number[] | Uint8Array | null,
  pairing: string
) {

  // -------- pre-action: get pool info --------
  const targetPool = RaydiumPools[pairing.replace("/", "_") as keyof typeof RaydiumPools];// USDC-RAY pool
  const ammPool = await (await fetch(ENDPOINT + RAYDIUM_MAINNET_API.poolInfo)).json() // If the Liquidity pool is not required for routing, then this variable can be configured as undefined
  const targetPoolInfo = [...ammPool.official, ...ammPool.unOfficial].find((info) => info.id === targetPool)
  assert(targetPoolInfo, 'cannot find the target pool')
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys

  const skBuffer = Buffer.from(secretKey!);
  const wallet = Keypair.fromSecretKey(skBuffer);

  const [token] = pairing.split("/");

  const decimal = token === "SOL"? 9 : 6;

  const tk = new Token(TOKEN_PROGRAM_ID, poolKeys.baseMint, decimal);
  const usd = new Token(TOKEN_PROGRAM_ID, poolKeys.quoteMint, decimal);

  const inputToken = (side === "buy")? usd : tk;
  const outputToken = (side === "buy")? tk : usd;

  const inputTokenAmount = new TokenAmount(inputToken, ammount * 1000000)
  const slippage = new Percent(1, 100)
  
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  const txids = await swapOnlyAmm(wallet, {
    outputToken,
    targetPool,
    inputTokenAmount,
    slippage,
    walletTokenAccounts,
    wallet: wallet,
  }, poolKeys);

  await checkTx(txids.txids[0]);
}