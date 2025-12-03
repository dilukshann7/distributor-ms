import axios from "axios";

export class Invoice {
  static async create(invoiceData) {
    const apiURL = "http://localhost:3000/api/invoices";
    return axios.post(apiURL, invoiceData);
  }
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/invoices";

    return axios.get(apiURL);
  }
}
