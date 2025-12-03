import axios from "axios";

export class Cart {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/carts";
    return axios.get(apiURL);
  }
}
