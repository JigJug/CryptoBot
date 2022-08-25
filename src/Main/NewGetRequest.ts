const https = require('https');

export class HttpsGetRequest {

    endPoint: string | null

    constructor (endPoint: string | null){

        this.endPoint = endPoint;
    }

    //methods
    httpsGet(){
        //executes get request 
        //converts buffer to string and resolves with full string
        //if there is no data after 2 seconds the promise resolves with the data

        return new Promise<any> ((resolve, reject) => {

            let timer: NodeJS.Timeout = setTimeout(()=>{resolve(opStr);}, 10000);

            let opStr: string = '';
            
            https.get(this.endPoint, (res: any) => {

                res.on('data', (d: any) => {
                    clearTimeout(timer);
                    opStr = opStr + d.toString()
                    timer = setTimeout(()=>{resolve(opStr);}, 2000);
                });
            
            }).on('error', (e: Error) => {
                clearTimeout(timer)
                reject(e);
            });
        });
    }
}