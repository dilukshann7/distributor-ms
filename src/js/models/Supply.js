import axios from "axios";

export class Supply {
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/supplies";
    return axios.get(apiURL);
  }

  static async getMostStocked(limit) {
    const apiURL = `http://localhost:3000/api/supplies?top=${limit}`;
    return axios.get(apiURL);
  }

  static async create(supplyData) {
    const apiURL = "http://localhost:3000/api/supplies";
    return axios.post(apiURL, supplyData);
  }

  static async update(id, supplyData) {
    const apiURL = `http://localhost:3000/api/supplies/${id}`;
    return axios.put(apiURL, supplyData);
  }
}
