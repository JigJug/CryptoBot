"use strict";
//USE NODEJS STREAM.WRITEABLE!!! PIPE TO FTX HANDLER and remove the timer delay 
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsGetRequest = void 0;
const https = require('https');
class HttpsGetRequest {
    //methods
    httpsGet(endPoint) {
        //executes get request 
        //converts buffer to string and resolves with full string
        //if there is no data after 2 seconds the promise resolves with the data
        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => { resolve(opStr); }, 10000);
            let opStr = '';
            https.get(endPoint, (res) => {
                res.on('data', (d) => {
                    clearTimeout(timer);
                    console.log('new data ');
                    console.log(d + '\n');
                    opStr = opStr + d.toString();
                    timer = setTimeout(() => { resolve(opStr); }, 2000);
                });
            }).on('error', (e) => {
                clearTimeout(timer);
                reject(e);
            });
        });
    }
}
exports.HttpsGetRequest = HttpsGetRequest;
