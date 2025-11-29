import axios from "axios";
import { User } from "./User";

export class Supplier extends User {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/suppliers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/suppliers/${id}`;
    return axios.get(apiURL);
  }

  static async create(supplierData) {
    const apiURL = "http://localhost:3000/api/suppliers";
    return axios.post(apiURL, supplierData);
  }

  static async update(id, supplierData) {
    const apiURL = `http://localhost:3000/api/suppliers/${id}`;
    return axios.put(apiURL, supplierData);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/suppliers/${id}`;
    return axios.delete(apiURL);
  }
}
