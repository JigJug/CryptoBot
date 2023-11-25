import { orcaApiSwap } from "./OrcaSwaps/orcaSwap";

export class LoadExchange {
  exchange;

  constructor(exchange: string) {
    this.exchange = exchange;
  }

  swapClient() {
    if (this.exchange == "orca") {
      return this.getOrca();
    } else {
      return (
        ammount: number,
        side: string,
        secretKey: number[] | Uint8Array | null,
        pairing: string
      ) => {
        return new Promise((resolve, reject) => {
          reject(new Error("can not load exchange: check the bot configs"));
        });
      };
    }
  }

  getOrca() {
    return orcaApiSwap;
  }
}
