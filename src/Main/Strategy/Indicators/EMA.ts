export class EMA {
  period: number;

  constructor(period: number) {
    this.period = period;
  }

  //methods
  emaCalc(priceToday: number, emaYesterday: number) {
    let N: number = this.period;
    let t: number = priceToday;
    let y: number = emaYesterday;
    let k: number = 2 / (N + 1);
    let emaToday = t * k + y * (1 - k);

    return emaToday;
  }
}
