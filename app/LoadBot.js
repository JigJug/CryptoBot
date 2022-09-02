"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBot = void 0;
const LoadModules_1 = require("./LoadModules");
function startBot() {
    return new LoadModules_1.LoadBot();
}
exports.startBot = startBot;
