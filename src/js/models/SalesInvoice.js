import axios from "axios";
export class SalesInvoice {
  constructor(data) {
    this.id = data.id;
    this.invoiceNumber = data.invoiceNumber;
    this.customerId = data.customerId;
    this.date = data.date;
    this.paymentMethod = data.paymentMethod;
    this.items = data.items; // Array of items
    this.subtotal = data.subtotal;
    this.collectedAmount = data.collectedAmount;
    this.collectedAt = data.collectedAt;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll() {
    const apiURL = "http://localhost:3000/api/sales-invoices";
    return axios.get(apiURL);
  }

  static async findById(id) {
    const apiURL = `http://localhost:3000/api/sales-invoices/driver/${id}`;
    return axios.get(apiURL);
  }
}
