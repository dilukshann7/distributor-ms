import axios from "axios";
import { User } from "./User.js";

export class Distributor extends User {
  static async getAll() {
    const apiURL = "/api/distributors";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/distributors/${id}`;
    return axios.get(apiURL);
  }

  static async create(distributorData) {
    const apiURL = "/api/distributors";
    return axios.post(apiURL, distributorData);
  }

  static async update(id, distributorData) {
    const apiURL = `/api/distributors/${id}`;
    return axios.put(apiURL, distributorData);
  }

  static async delete(id) {
    const apiURL = `/api/distributors/${id}`;
    return axios.delete(apiURL);
  }
}
