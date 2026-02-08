import axios from "axios";
import { User } from "./User.js";
import { SalesOrder } from "./SalesOrder.js";

export class Salesman extends User {
  static async getAll() {
    const apiURL = "/api/salesmen";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/api/salesmen/${id}`;
    return axios.get(apiURL);
  }

  static async create(salesmanData) {
    const apiURL = "/api/salesmen";
    return axios.post(apiURL, salesmanData);
  }

  static async update(id, salesmanData) {
    const apiURL = `/api/salesmen/${id}`;
    return axios.put(apiURL, salesmanData);
  }

  static async delete(id) {
    const apiURL = `/api/salesmen/${id}`;
    return axios.delete(apiURL);
  }

  static async exportReport(startDate, endDate) {
    return SalesOrder.exportSalesReport(startDate, endDate);
  }
}
