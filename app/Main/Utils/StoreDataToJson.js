"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreDataJson = void 0;
const fs = __importStar(require("fs"));
/*
data to json
*/
class StoreDataJson {
    constructor(path, name1, name2) {
        this.path = path;
        this.name1 = name1;
        this.name2 = name2;
    }
    storeToJson(data) {
        return new Promise((resolve, reject) => {
            let fileName = `${this.path}${this.name1}${this.name2}.json`;
            let dataStr = JSON.stringify(data, null, 2);
            fs.writeFile(fileName, dataStr, (err) => {
                if (err) {
                    console.log(err);
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
