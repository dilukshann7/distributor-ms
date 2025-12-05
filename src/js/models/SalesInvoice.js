import axios from "axios";
export class SalesInvoice {
  static async getAll() {
    const apiURL = "/sales-invoices";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `/sales-invoices/driver/${id}`;
    return axios.get(apiURL);
  }
}
