import axios from "axios";

export class Invoice {
  static async create(invoiceData) {
    const apiURL = "/api/invoices";
    return axios.post(apiURL, invoiceData);
  }
  static async getAll(filters) {
    const apiURL = "/api/invoices";

    return axios.get(apiURL);
  }
  static async getById(id) {
    const apiURL = `/api/invoices/${id}`;
    return axios.get(apiURL);
  }
}
