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
}
