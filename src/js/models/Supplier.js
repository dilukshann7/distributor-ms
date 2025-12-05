import axios from "axios";
import { User } from "./User";

export class Supplier extends User {
  static async getAll() {
    const apiURL = "/api/suppliers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/suppliers/${id}`;
    return axios.get(apiURL);
  }

  static async create(supplierData) {
    const apiURL = "/api/suppliers";
    return axios.post(apiURL, supplierData);
  }

  static async update(id, supplierData) {
    const apiURL = `/api/suppliers/${id}`;
    return axios.put(apiURL, supplierData);
  }

  static async delete(id) {
    const apiURL = `/api/suppliers/${id}`;
    return axios.delete(apiURL);
  }
}
