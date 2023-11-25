import * as https from "https";

export class HttpsGetRequest {
  httpsGet(endPoint: string) {
    return new Promise<any>((resolve, reject) => {
      let timer: NodeJS.Timeout = setTimeout(() => {
        resolve(opStr);
      }, 5000);

      let opStr: string = "";

      https
        .get(endPoint, (res: any) => {
          res.on("data", (d: any) => {
            opStr = opStr + d.toString();
          });

          res.on("end", () => {
            clearTimeout(timer);
            resolve(opStr);
          });
        })
        .on("error", (e: Error) => {
          clearTimeout(timer);
          reject(e);
        });
    });
  }
}
