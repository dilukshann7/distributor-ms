import axios from "axios";

export class Delivery {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/deliveries";

    return axios.get(apiURL);
  }

  static async create(data) {
    const apiURL = "http://localhost:3000/api/deliveries";

    return axios.post(apiURL, data);
  }

  static async update(id, data) {
    const apiURL = `http://localhost:3000/api/deliveries/${id}`;

    return axios.put(apiURL, data);
  }
}
