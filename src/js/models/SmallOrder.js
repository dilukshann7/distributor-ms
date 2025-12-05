import axios from "axios";

export class smallOrder {
  static async getAll() {
    const apiURL = "/api/small-orders";
    return axios.get(apiURL);
  }
}
