import EventEmitter from "events";
import { BaseStrategy } from "../../typings";
import { SimpleEmaStrategy } from "./Strategies/SimpleEma";

export class Strategy {
  strategy;

  constructor(strategy: string) {
    this.strategy = strategy;
  }

  loadStrategy(
    stopLoss: number,
    events: EventEmitter,
    id: string,
    pubkey: string
  ) {
    const strategy: Record<string, () => BaseStrategy> = {
      simpleema: () => new SimpleEmaStrategy(stopLoss, events, id, pubkey),
    };
    return strategy[this.strategy]();
  }
}
