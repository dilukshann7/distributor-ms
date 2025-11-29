import axios from "axios";
import { User } from "./User";

export class Manager extends User {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/managers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/managers/${id}`;
    return axios.get(apiURL);
  }

  static async create(managerData) {
    const apiURL = "http://localhost:3000/api/managers";
    return axios.post(apiURL, managerData);
  }

  static async update(id, managerData) {
    const apiURL = `http://localhost:3000/api/managers/${id}`;
    return axios.put(apiURL, managerData);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/managers/${id}`;
    return axios.delete(apiURL);
  }
}
