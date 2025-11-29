import axios from "axios";

export class SalesOrder {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/sales-orders";

    return axios.get(apiURL);
  }

  static async create(orderData) {
    const apiURL = "http://localhost:3000/api/sales-orders";

    return axios.post(apiURL, orderData);
  }

  static async update(id, orderData) {
    const apiURL = "http://localhost:3000/api/sales-orders/" + id;

    return axios.put(apiURL, orderData);
  }

  static async delete(id) {
    const apiURL = "http://localhost:3000/api/sales-orders/" + id;

    return axios.delete(apiURL);
  }
}
