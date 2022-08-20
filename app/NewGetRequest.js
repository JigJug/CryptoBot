"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsGetRequest = void 0;
var https = require('https');
var HttpsGetRequest = /** @class */ (function () {
    function HttpsGetRequest(endPoint) {
        this.endPoint = endPoint;
    }
    //methods
    HttpsGetRequest.prototype.httpsGet = function () {
        //executes get request 
        //converts buffer to string and resolves with full string
        //if there is no data after 2 seconds the promise resolves with the data
        var _this = this;
        return new Promise(function (resolve, reject) {
            var timer = setTimeout(function () { resolve(opStr); }, 10000);
            var opStr = '';
            https.get(_this.endPoint, function (res) {
                res.on('data', function (d) {
                    clearTimeout(timer);
                    opStr = opStr + d.toString();
                    timer = setTimeout(function () { resolve(opStr); }, 2000);
                });
            }).on('error', function (e) {
                clearTimeout(timer);
                reject(e);
            });
        });
    };
    return HttpsGetRequest;
}());
exports.HttpsGetRequest = HttpsGetRequest;
