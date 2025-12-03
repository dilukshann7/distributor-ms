import axios from "axios";

export class Payment {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/payments";

    return axios.get(apiURL);
  }

  static async create(payment) {
    const apiURL = "http://localhost:3000/api/payments";

    return axios.post(apiURL, payment);
  }

  static async update(id, payment) {
    const apiURL = `http://localhost:3000/api/payments/${id}`;

    return axios.put(apiURL, payment);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/payments/${id}`;

    return axios.delete(apiURL);
  }
}
