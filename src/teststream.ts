import { FtxPriceEmmiterCollection } from "./EmiterCollection";

const rec = new FtxPriceEmmiterCollection();

rec.sendPrice();

rec.on('price', data => {
    console.log(data)
})