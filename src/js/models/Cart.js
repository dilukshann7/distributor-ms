import axios from "axios";

export class Cart {
  static async getAll() {
    const apiURL = "/api/carts";
    return axios.get(apiURL);
  }

  static async create(cartData) {
    const apiURL = "/api/carts";
    return axios.post(apiURL, cartData);
  }

  static async update(cartId, cartData) {
    const apiURL = `/api/carts/${cartId}`;
    return axios.put(apiURL, cartData);
  }
}
