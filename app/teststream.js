"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmiterCollection_1 = require("./EmiterCollection");
const rec = new EmiterCollection_1.FtxPriceEmmiterCollection();
rec.sendPrice();
rec.on('price', data => {
    console.log(data);
});
