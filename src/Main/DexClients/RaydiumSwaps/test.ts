import assert from 'assert';
import * as fs from 'fs';

import {
    Price,
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
  LOOKUP_TABLE_CACHE,
  RAYDIUM_MAINNET,
  TxVersion,
  LiquidityPoolKeysV4,
  Currency,
  MAINNET_OFFICIAL_LIQUIDITY_POOLS,
  MAINNET_LP_TOKENS,
  MAINNET_PROGRAM_ID
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
import { StoreDataJson } from '../../Utils/StoreDataToJson';
import { RayPoolInfo } from '../../../typings';
import { delay } from '../../Utils/utils';
import { connection } from './RaydiumSwap';

/**
 * routinely fetch pool data and store to json
 * this will cut 5 seconds from the pool lookup
*/
async function fetchpoolrec(count: number) {
    console.log(`fetching pool info. count = ${count}`)
    if(count > 7) return
    
    const ammPool: RayPoolInfo = await (await fetch(ENDPOINT + RAYDIUM_MAINNET_API.poolInfo)).json()

    await sj.storeToJson(ammPool);

    count++

    await delay(25000);

    //fetchpoolrec(count);
}


/**
 * tests 
 * see if we can get pool key using the ca
 * checking price on chain with raydium sdk? or with solana lib?
*/


/**
 * test 1 - find liquidity pool
 * contract address = base mint
 * liquidity pool = id
 * fetch pool info from raydium api and make a search against base mint and return id
*/

const pools = fs.readFileSync("D:\\CryptoProject\\CryptoBot\\rayliqpools.json");

const poolsj:RayPoolInfo = JSON.parse(pools.toString());

const ca = "4cLX1cHWEEGr9iUg7gkNcheHuoAZfW1n6QkPnJNb6XTt"; //smorf token

const sj = new StoreDataJson("./hello", "werfwf", "33fd");

const ENDPOINT = _ENDPOINT;

const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;

async function go() {

    const lp = [...poolsj.official, ...poolsj.unOfficial].find((v) => v.baseMint === ca);

    console.log(lp);

}

const pubkey = new PublicKey(ca);


async function gliq() {
    try {
        
    } catch (error) {
        
    }
    const liq = await Liquidity.fetchAllPoolKeys(connection, {4: pubkey, 5:pubkey}) //tokenprogid?

    console.log(liq)
}


//gliq();
const raypoolsv4 = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
const raypoolsv4pk = new PublicKey(MAINNET_PROGRAM_ID.AmmV4)
async function getaccs() {
    try {
        const accs = await connection.getProgramAccounts(raypoolsv4pk)
        console.log(accs)
    } catch (error) {
        console.log(error)
    }

}
getaccs()
//MAINNET_LP_TOKENS
//MAINNET_OFFICIAL_LIQUIDITY_POOLS
//MAINNET_PROGRAM_ID.AmmV4