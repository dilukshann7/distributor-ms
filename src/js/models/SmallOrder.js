import axios from "axios";

export class smallOrder {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/small-orders";
    return axios.get(apiURL);
  }
}
