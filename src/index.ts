//export {default as startBot} from './startbot';

import startBot from "./startbot";

import express from 'express';
import { Keypair } from "@solana/web3.js";
import cors from 'cors';
import bodyParser from 'body-parser';


export function createWallet() {
    return Keypair.generate();
}

const w = createWallet();

const app = express();

const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    
    //res.set('Access-Control-Allow-Origin', '*');
    res.send('HELLO FROM BOT GET REQUEST')
    
})

app.post('/startbot', (req, res) => {
    //res.set('Access-Control-Allow-Origin', '*');
    
    res.send('BOT STARTED')
    console.log(req.body)
    startBot();
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//startBot();