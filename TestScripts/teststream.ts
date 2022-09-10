import { EmiterCollection } from "../Main/EmiterCollection";

const rec = new EmiterCollection('RAY/USD', '14400')

rec.sendPrice();

rec.on('price', (data: any) => {
    console.log(data)
})