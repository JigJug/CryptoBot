import { Keypair } from "@solana/web3.js";

export function createWallet() {
  return Keypair.generate();
}
