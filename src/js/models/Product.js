import axios from "axios";

export class Product {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/products";

    return axios.get(apiURL);
  }

  static async create(product) {
    const apiURL = "http://localhost:3000/api/products";

    return axios.post(apiURL, product);
  }

  static async update(id, product) {
    const apiURL = `http://localhost:3000/api/products/${id}`;

    return axios.put(apiURL, product);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/products/${id}`;

    return axios.delete(apiURL);
  }
}
