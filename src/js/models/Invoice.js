import axios from "axios";

// Invoice Class
export class Invoice {
  constructor(data) {
    this.id = data.id;
    this.invoiceNumber = data.invoiceNumber;
    this.purchaseOrderId = data.purchaseOrderId;
    this.supplierId = data.supplierId;
    this.invoiceDate = data.invoiceDate;
    this.dueDate = data.dueDate;
    this.paidDate = data.paidDate;
    this.totalAmount = data.totalAmount;
    this.paidAmount = data.paidAmount;
    this.balance = data.balance;
    this.status = data.status;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async create(invoiceData) {
    const apiURL = "http://localhost:3000/api/invoices";
    return axios.post(apiURL, invoiceData);
  }
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/invoices";

    return axios.get(apiURL);
  }
}
