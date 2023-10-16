import { HttpsGetRequest } from "./HttpsGetRequest";


export class BaseClient {
    getReq: HttpsGetRequest;
    baseUrl: string;
    constructor(baseUrl: string){
        this.getReq = new HttpsGetRequest();
        this.baseUrl = baseUrl;
    }
    async get(endpoint: string) {
        return this.getReq.httpsGet(endpoint);
    }
}