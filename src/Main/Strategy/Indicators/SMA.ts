import { MarketDataObject } from "../../../typings";

export class SMA {
  period: number;

  constructor(period: number) {
    this.period = period;
  }

  //methods

  smaCalc(data: MarketDataObject[]) {
    let totalPrice = 0;

    for (let i = 0; i < this.period; i++) {
      totalPrice = totalPrice + data[i].close;
    }

    return totalPrice / this.period;
  }
}
