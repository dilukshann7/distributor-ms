import axios from "axios";
import { User } from "./User";

export class StockKeeper extends User {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/stock-keepers";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/stock-keepers/${id}`;
    return axios.get(apiURL);
  }

  static async create(stockKeeperData) {
    const apiURL = "http://localhost:3000/api/stock-keepers";
    return axios.post(apiURL, stockKeeperData);
  }

  static async update(id, stockKeeperData) {
    const apiURL = `http://localhost:3000/api/stock-keepers/${id}`;
    return axios.put(apiURL, stockKeeperData);
  }

  static async delete(id) {
    const apiURL = `http://localhost:3000/api/stock-keepers/${id}`;
    return axios.delete(apiURL);
  }
}
