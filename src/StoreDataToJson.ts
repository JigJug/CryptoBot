import fs = require('fs')

/*
data to json
*/

export class StoreDataJson {
  name1: string
  name2: string
  data 

  constructor(
      name1: string,
      name2: string,
      data: any
  ){
      this.name1 = name1
      this.name2 = name2
      this.data = data
  }

  storeToJson(){

    return new Promise<void>((resolve, reject)=>{

      let fileName = `..\\MarketData\\${this.name1}${this.name2}.json`

      this.data = JSON.stringify(this.data, null, 2);

      fs.writeFile(fileName, this.data, (err) => {
        if (err) {
          reject(err)
        }
        console.log('Data written to file');
        resolve()
      });

    });
  }
}