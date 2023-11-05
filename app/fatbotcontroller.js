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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FatBotController = void 0;
const loadbot_1 = __importDefault(require("./loadbot"));
class FatBotController {
    constructor() {
        this.bots = {};
        this.currentId = "100000";
    }
    generateId() {
        let id = parseInt(this.currentId, 16);
        this.currentId = (id + 1).toString(16).toUpperCase();
        return this.currentId;
    }
    loadbot(botConfig, pubkey, events) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(botConfig, pubkey);
            const pk = pubkey.toString();
            const newId = this.generateId();
            const nb = yield (0, loadbot_1.default)(botConfig, events, this.currentId, pubkey);
            const newb = {};
            newb[newId] = nb;
            //nb?.startBot();
            this.bots[pk] = newb;
            console.log(this.bots);
            return newId;
        });
    }
}
exports.FatBotController = FatBotController;
