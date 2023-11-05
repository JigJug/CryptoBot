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
exports.BaseClient = void 0;
const HttpsGetRequest_1 = require("../Utils/HttpsGetRequest");
class BaseClient extends HttpsGetRequest_1.HttpsGetRequest {
    constructor(endPoints) {
        super();
        this.endpoints = endPoints;
    }
    candleData() {
        return this.get(this.endpoints.candleData);
    }
    price() {
        return this.get(this.endpoints.price);
    }
    get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.httpsGet(endpoint);
        });
    }
}
exports.BaseClient = BaseClient;
