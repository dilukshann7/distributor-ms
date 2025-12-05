import axios from "axios";

export class Cart {
  static async getAll() {
    const apiURL = "/api/carts";
    return axios.get(apiURL);
  }
}
