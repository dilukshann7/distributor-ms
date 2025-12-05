import axios from "axios";

export class Delivery {
  static async getAll(filters) {
    const apiURL = "/api/deliveries";

    return axios.get(apiURL);
  }

  static async create(data) {
    const apiURL = "/api/deliveries";

    return axios.post(apiURL, data);
  }

  static async update(id, data) {
    const apiURL = `/api/deliveries/${id}`;

    return axios.put(apiURL, data);
  }
}
