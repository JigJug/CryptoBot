"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    //res.set('Access-Control-Allow-Origin', '*');
    res.send('HELLO FROM BOT GET REQUEST');
});
app.post('/startbot', (req, res) => {
    //res.set('Access-Control-Allow-Origin', '*');
    res.send('BOT STARTED');
    console.log(req.body);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//startBot();
