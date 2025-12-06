import axios from "axios";

export class Payment {
  static async getAll(filters) {
    const apiURL = "/api/payments";

    return axios.get(apiURL);
  }

  static async create(payment) {
    const apiURL = "/api/payments";

    return axios.post(apiURL, payment);
  }

  static async update(paymentId, updates) {
    const apiURL = `/api/payments/${paymentId}`;
    return axios.put(apiURL, updates);
  }
}
