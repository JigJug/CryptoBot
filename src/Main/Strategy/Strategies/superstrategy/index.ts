import * as fs from 'fs'
import {Console} from 'console';
import {PythonShell} from 'python-shell';

interface CandleData{
    startTime: number
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

function candleJsonToCsv() {
  const bdir = 'D:\\CryptoProject\\aisignals\\aisigs\\jsond\\';
  const files = fs.readdirSync(bdir)
  console.log(files)
  for(const file of files) {
    console.log(file)
    const rawdata = fs.readFileSync(`${bdir}${file}`).toString();
    const data = JSON.parse(rawdata);
    const stream = fs.createWriteStream(`${file}.csv`)
    const wrd = new Console(stream)
    data.map((v: CandleData, i: number) => {
      i === 0? wrd.log('startTime time open high low close volume') : null;
      //wrd.log(`${file.replace(/.json/, '')} ${v.startTime} ${v.time} ${v.open} ${v.high} ${v.low} ${v.close} ${v.volume}`);
      wrd.log(`${v.startTime} ${v.time} ${v.open} ${v.high} ${v.low} ${v.close} ${v.volume}`);
    });
    //stream.close();
  }
}

async function runModel(script: string) {
  try {
    const op = await PythonShell.run(script);
    return op;
  } catch (err) {
    throw err;
  }
}

function process(data: string[]) {
  return data.filter((v: string) => {
    return v.indexOf("Prediction") !== -1? v: null
  }).map((v: string) => {
    v = v.replace(/Prediction/g, `"Prediction"`);
    v = v.replace(/Actual/g, `"Actual"`);
    v = v.replace(/Decision/g, `"Decision"`);
    v = v.replace(/Buy/g, `"Buy"`);
    v = v.replace(/Sell/g, `"Sell"`);
    v = v.replace(/wait/g, `"wait"`);
    v = `{${v}}`;
    return JSON.parse(v);
  });
}

interface Decessions {
  Prediction: number
  Actual: number
  Decision: string
}

interface BuysSells{
  buy: number
  sell: number
  percent: number
}

function getBuySell(deces: Decessions[]) {

  const calcPcnt = (num1: number, num2: number) => {
    return (num2 - num1) / num1;
  }


  
  const op = [];
  let curPos = '';

  let prevCl = 0;
  let buy = 0;
  let sell = 0;
  let percent = 0;

  for(let i = 0; i < deces.length; i++){


    if(deces[i].Decision === "wait") continue;

    //start: set current pos at start should be a buy
    if(curPos == '' && deces[i].Decision === "Sell") continue;
    if(curPos == '') {
      //console.log("starting")
      curPos = deces[i].Decision;
      buy = deces[i].Actual;
    }

    //logic after start
    if(curPos === "Sell" && deces[i].Decision === "Buy"){
      //console.log("found buy")
      curPos = deces[i].Decision;
      buy = deces[i].Actual;
      continue
    }

    if(curPos === "Buy" && deces[i].Decision === "Sell"){// || i == deces.length - 1){
      //console.log("found sell")
      curPos = deces[i].Decision;
      sell = deces[i].Actual;
      percent = calcPcnt(buy, sell);
      //console.log(buy, sell, percent)
      op.push({buy, sell, percent});
    }
  }
  return op;
}

function calcPercentTotal(buySells: BuysSells[]){
  let money = 1000
  buySells.map((v: BuysSells) => {
    let pnl = money * v.percent;
    if(pnl < (-money) * 0.06) pnl = (-money) * 0.06
    money = money + pnl;
    console.log('bal: ', money, 'pnl: ',pnl)
  })
  console.log('finished pnl calc', money)
  return money - 1000
}

async function run() {
  const script = '../seq_maxsc_1train_1test.py'
  try {
    const data = await runModel(script);
    const decessions: Decessions[] = process(data);
    const getbs = getBuySell(decessions);
    console.log(getbs)
    const pnl = calcPercentTotal(getbs);
    console.log(pnl)

  } catch (err) {
    console.log(err)
  }

}


//run();

//candleJsonToCsv();

