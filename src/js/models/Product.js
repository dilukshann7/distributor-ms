import axios from "axios";

export class Product {
  static async getAll(filters) {
    const apiURL = "/api/products";

    return axios.get(apiURL);
  }

  static async create(product) {
    const apiURL = "/api/products";

    return axios.post(apiURL, product);
  }

  static async update(id, product) {
    const apiURL = `/api/products/${id}`;

    return axios.put(apiURL, product);
  }

  static async delete(id) {
    const apiURL = `/api/products/${id}`;

    return axios.delete(apiURL);
  }
}
