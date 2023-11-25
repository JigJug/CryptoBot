import { BotConfig, Endpoints } from "../../typings";

function binanceEndpoints(config: BotConfig) {
  const baseUrl = "https://api.binance.com/api/v3/";
  return {
    candleData: `${baseUrl}klines?symbol=${config.pairing.replace(
      "/",
      ""
    )}&interval=${config.windowResolution}`,
    price: `${baseUrl}ticker/price?symbol=${config.pairing.replace("/", "")}`,
  };
}

export function endpoints(config: BotConfig) {
  const getBaseUrl: Record<string, () => Endpoints> = {
    binance: () => binanceEndpoints(config),
  };
  return getBaseUrl[config.cexData]();
}
