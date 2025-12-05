import axios from "axios";
import { User } from "./User";

export class Driver extends User {
  static async getAll() {
    const apiURL = "/api/drivers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/drivers/${id}`;
    return axios.get(apiURL);
  }

  static async create(driverData) {
    const apiURL = "/api/drivers";
    return axios.post(apiURL, driverData);
  }

  static async update(id, driverData) {
    const apiURL = `/api/drivers/${id}`;
    return axios.put(apiURL, driverData);
  }

  static async delete(id) {
    const apiURL = `/api/drivers/${id}`;
    return axios.delete(apiURL);
  }
}
