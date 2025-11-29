import axios from "axios";
import { User } from "./User";

export class Cashier extends User {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/cashiers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/cashiers/${id}`;
    return axios.get(apiURL);
  }

  static async create(cashierData) {
    const apiURL = "http://localhost:3000/api/cashiers";
    return axios.post(apiURL, cashierData);
  }

  static async update(id, cashierData) {
    const apiURL = `http://localhost:3000/api/cashiers/${id}`;
    return axios.put(apiURL, cashierData);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/cashiers/${id}`;
    return axios.delete(apiURL);
  }
}
