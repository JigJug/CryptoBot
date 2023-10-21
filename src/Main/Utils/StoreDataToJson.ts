import * as fs from 'fs'

/*
data to json
*/

export class StoreDataJson {
  path: string
  name1: string
  name2: string

  constructor(
    path: string,
    name1: string,
    name2: string,
  ){
    this.path = path
    this.name1 = name1
    this.name2 = name2
  }

  storeToJson(data: []){
    return new Promise<void>((resolve, reject)=>{
      let fileName = `${this.path}${this.name1}${this.name2}.json`
      let dataStr = JSON.stringify(data, null, 2);
      fs.writeFile(fileName, dataStr, (err) => {
        if (err) {
          console.log(err)
          reject(err)
        }else {
          console.log('Data written to file');
          resolve()
        }
      });
    });
  }
}