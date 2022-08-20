"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreDataJson = void 0;
var fs = require("fs");
/*
data to json
*/
var StoreDataJson = /** @class */ (function () {
    function StoreDataJson(name1, name2, data) {
        this.name1 = name1;
        this.name2 = name2;
        this.data = data;
    }
    StoreDataJson.prototype.storeToJson = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var fileName = "..\\MarketData\\" + _this.name1 + _this.name2 + ".json";
            _this.data = JSON.stringify(_this.data, null, 2);
            fs.writeFile(fileName, _this.data, function (err) {
                if (err) {
                    reject(err);
                }
                console.log('Data written to file');
                resolve();
            });
        });
    };
    return StoreDataJson;
}());
exports.StoreDataJson = StoreDataJson;
