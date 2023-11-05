"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolKey = exports.testEnum = void 0;
var testEnum;
(function (testEnum) {
    testEnum["coin1"] = "hello1";
    testEnum["coin2"] = "hello2";
    testEnum["coin3"] = "hello3";
})(testEnum = exports.testEnum || (exports.testEnum = {}));
//let pools: any = {
//    coin1: 'wf8wef98wuf',
//    coin2: 'wffwf2f4g35hw45u',
//    coin3: '34fq3g34tgq34g'
//}
const getPoolKey = (pairing) => {
    let x;
    let y = testEnum;
    let pairing1 = pairing.replace('/', '');
    x = y[pairing1];
    return x;
};
exports.getPoolKey = getPoolKey;
//console.log(getPoolKey('coi/n1', testEnum))
//console.log('hello1')
function testFunProm() {
    return new Promise((resolve, reject) => {
        let timeNow = new Date().getTime();
        console.log('function invoked');
        function checkTransactionError(timeNow, signature) {
            let newtime = new Date().getTime();
            let tdiff = newtime - timeNow;
            if (tdiff > 30000) {
                return reject(new Error('Transaction not processed'));
            }
            const hi = () => __awaiter(this, void 0, void 0, function* () {
                //const status = connection.getSignatureStatus(signature);
                const status = testPromise();
                const status_1 = yield status;
                if (status_1.x == 3) {
                    if (status_1.y == 8) {
                        console.log('error');
                        return reject(new Error('Transaction Failed'));
                    }
                    else if (status_1.z == 7) {
                        console.log('resolve');
                        return resolve();
                    }
                }
                console.log('not found... checking again');
                checkTransactionError(timeNow, signature);
            });
            return hi();
        }
        checkTransactionError(timeNow, 'hello');
    });
}
//check transaction
//console.log('hello2')
function testPromise() {
    return new Promise((resolve) => {
        let x = Math.round((Math.random() * 10));
        let y = Math.round(Math.random() * 10);
        let z = Math.round(Math.random() * 10);
        let ret = {
            x: x,
            y: y,
            z: z
        };
        resolve(ret);
    });
}
//testFunProm().then(()=>{
//    console.log('fiished and resolved')
//})
//.catch((err) => {console.log(err)})
//console.log('hello3')
//console.log(getPoolKey('coi/n3'))
let w = '';
const dt = () => { console.log('1'); };
const go = () => {
    if (w == 'g') {
        return dt();
    }
    else {
        return () => { console.log(2); };
    }
};
go();
