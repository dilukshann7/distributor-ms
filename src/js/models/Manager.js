import axios from "axios";
import { User } from "./User";

export class Manager extends User {
  static async getAll() {
    const apiURL = "/api/managers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/managers/${id}`;
    return axios.get(apiURL);
  }

  static async create(managerData) {
    const apiURL = "/api/managers";
    return axios.post(apiURL, managerData);
  }

  static async update(id, managerData) {
    const apiURL = `/api/managers/${id}`;
    return axios.put(apiURL, managerData);
  }

  static async delete(id) {
    const apiURL = `/api/managers/${id}`;
    return axios.delete(apiURL);
  }
}
