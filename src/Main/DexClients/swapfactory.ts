import { DexSwap } from "../../typings";
import { orcaApiSwap } from "./OrcaSwaps/orcaSwap";
import { raydiumApiSwap } from "./RaydiumSwaps/RaydiumSwap";

class RaydiumApiSwap implements DexSwap {
    swap(ammount: number, side: string, secretKey: Uint8Array | number[] | null, pairing: string) {
        return raydiumApiSwap(ammount, side, secretKey, pairing)
    }
}

class OrcaApiSwap implements DexSwap {
    swap(ammount: number, side: string, secretKey: Uint8Array | number[] | null, pairing: string) {
        return orcaApiSwap(ammount, side, secretKey, pairing)
    }
}

export function dexRouter(dex: string) {
    const dexClient: Record<string, () => DexSwap> = {
        orca: () => new OrcaApiSwap(),
        raydium: () => new RaydiumApiSwap()
    }
    return dexClient[dex]();
}