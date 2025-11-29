import axios from "axios";
export class SalesInvoice {
  static async getAll() {
    const apiURL = "http://localhost:3000/api/sales-invoices";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/sales-invoices/driver/${id}`;
    return axios.get(apiURL);
  }
}
