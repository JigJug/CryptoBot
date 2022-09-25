import { Enum } from "@solana/web3.js";

export enum testEnum {
    coin1 = 'hello1',
    coin2 = 'hello2',
    coin3 = 'hello3'
}


//let pools: any = {
//    coin1: 'wf8wef98wuf',
//    coin2: 'wffwf2f4g35hw45u',
//    coin3: '34fq3g34tgq34g'
//}

export const getPoolKey = (pairing: string) => {
    let x: string | number | {}
    let y = testEnum
    let pairing1: string = pairing.replace('/', '')
    
    x = y[pairing1 as keyof typeof y]
    return x
    
}

//console.log(getPoolKey('coi/n1', testEnum))
//console.log('hello1')
function testFunProm(){
    return new Promise<void>((resolve, reject)=>{

        let timeNow = new Date().getTime();

        console.log('function invoked')

        function checkTransactionError(timeNow: number, signature: string){
            let newtime = new Date().getTime();
            let tdiff = newtime - timeNow
            if(tdiff > 30000){
                return reject(new Error('Transaction not processed'));
            }
            
            const hi = async () => {
                //const status = connection.getSignatureStatus(signature);
                const status = testPromise();

                const status_1 = await status
                if (status_1.x == 3) {
                    if (status_1.y == 8) {
                        console.log('error')
                        return reject(new Error('Transaction Failed'))
                    } else if (status_1.z == 7) {
                        console.log('resolve')
                        return resolve()
                    }
                }
                console.log('not found... checking again')
                checkTransactionError(timeNow, signature)
            };
            return hi();
        }


        checkTransactionError(timeNow, 'hello');

    })
}

//check transaction

//console.log('hello2')
function testPromise(){
    return new Promise<XY>((resolve)=>{
        let x = Math.round((Math.random() * 10))
        let y = Math.round(Math.random() * 10)
        let z = Math.round(Math.random() * 10)
        
        let ret = {
            x: x,
            y: y,
            z: z
        }
        resolve(ret);
    })
}

export interface XY{
    x: number;
    y: number;
    z: number;
}


//testFunProm().then(()=>{
//    console.log('fiished and resolved')
//})
//.catch((err) => {console.log(err)})
//console.log('hello3')


console.log(getPoolKey('coi/n3'))