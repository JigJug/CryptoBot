export enum testEnum {
    coin1 = 'hello1',
    coin2 = 'hello2',
    coin3 = 'hello3'
}


let pools: any = {
    coin1: 'wf8wef98wuf',
    coin2: 'wffwf2f4g35hw45u',
    coin3: '34fq3g34tgq34g'
}

export const getPoolKey = (pairing: string, pools: any) => {
    let pairing1: string = pairing.replace('/', '')
    if(pools.hasOwnProperty(pairing1)){
        return pools[pairing1]
    }
}

console.log(getPoolKey('coi/n1', testEnum))
