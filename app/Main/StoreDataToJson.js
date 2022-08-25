"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreDataJson = void 0;
const fs = require("fs");
/*
data to json
*/
class StoreDataJson {
    //data 
    constructor(path, name1, name2) {
        this.path = path;
        this.name1 = name1;
        this.name2 = name2;
        //this.data = data
    }
    storeToJson(data) {
        return new Promise((resolve, reject) => {
            let fileName = `${this.path}${this.name1}${this.name2}.json`;
            let dataStr = JSON.stringify(data, null, 2);
            fs.writeFile(fileName, dataStr, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('Data written to file');
                    resolve();
                }
            });
        });
    }
}
exports.StoreDataJson = StoreDataJson;
