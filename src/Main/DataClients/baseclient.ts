import { Endpoints } from "../../typings";
import { HttpsGetRequest } from "../Utils/HttpsGetRequest";

export class BaseApiClient extends HttpsGetRequest {
  endpoints: Endpoints;
  constructor(endPoints: Endpoints) {
    super();
    this.endpoints = endPoints;
  }
  candleData() {
    return this.get(this.endpoints.candleData);
  }

  price() {
    return this.get(this.endpoints.price);
  }

  private async get(endpoint: string) {
    return this.httpsGet(endpoint);
  }
}

export class BaseDegenClient {
  
}