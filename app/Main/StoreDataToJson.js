"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreDataJson = void 0;
const fs = require("fs");
/*
data to json
*/
class StoreDataJson {
    constructor(path, name1, name2, data) {
        this.path = path;
        this.name1 = name1;
        this.name2 = name2;
        this.data = data;
    }
    storeToJson() {
        return new Promise((resolve, reject) => {
            let fileName = `${this.path}${this.name1}${this.name2}.json`;
            this.data = JSON.stringify(this.data, null, 2);
            fs.writeFile(fileName, this.data, (err) => {
                if (err) {
                    reject(err);
                }
                console.log('Data written to file');
                resolve();
            });
        });
    }
}
exports.StoreDataJson = StoreDataJson;
