
import {
  Liquidity,
  SPL_ACCOUNT_LAYOUT,
  TOKEN_PROGRAM_ID,
  TokenAccount,
  ENDPOINT as _ENDPOINT,
  LiquidityPoolKeysV4,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { TestTxInputInfo } from '../../../typings';

export async function computeAmmountOut(input: TestTxInputInfo, poolKeys: LiquidityPoolKeysV4, connection: Connection) {
  return Liquidity.computeAmountOut({
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: input.inputTokenAmount,
    currencyOut: input.outputToken,
    slippage: input.slippage,
  })
}

export async function getWalletTokenAccount(connection: Connection, wallet: PublicKey): Promise<TokenAccount[]> {
  const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet, {
    programId: TOKEN_PROGRAM_ID,
  });
  return walletTokenAccount.value.map((i) => ({
    pubkey: i.pubkey,
    programId: i.account.owner,
    accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
  }));
}

