import axios from "axios";
import { User } from "./User";

export class Salesman extends User {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/salesmen";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/salesmen/${id}`;
    return axios.get(apiURL);
  }

  static async create(salesmanData) {
    const apiURL = "http://localhost:3000/api/salesmen";
    return axios.post(apiURL, salesmanData);
  }

  static async update(id, salesmanData) {
    const apiURL = `http://localhost:3000/api/salesmen/${id}`;
    return axios.put(apiURL, salesmanData);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/salesmen/${id}`;
    return axios.delete(apiURL);
  }
}
