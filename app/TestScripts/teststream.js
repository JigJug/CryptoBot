"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmiterCollection_1 = require("../Main/EmiterCollection");
const rec = new EmiterCollection_1.EmiterCollection('RAY/USD', '14400');
rec.sendPrice();
rec.on('price', (data) => {
    console.log(data);
});
