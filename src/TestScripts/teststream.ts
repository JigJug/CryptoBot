import { FtxClient } from "../Main/CexClients/FtxClient";
import { EmiterCollection } from "../Main/EmiterCollection";

const rec = new EmiterCollection()
const cli = new FtxClient('', '')

rec.sendPrice(cli);

rec.on('price', (data: any) => {
    console.log(data)
})