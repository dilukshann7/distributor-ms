import axios from "axios";

/**
 * PurchaseInvoice - Invoices FROM suppliers (extends base Invoice)
 * Used for tracking payments to suppliers
 */
export class PurchaseInvoice {
  static async create(invoiceData) {
    const apiURL = "/api/purchase-invoices";
    return axios.post(apiURL, invoiceData);
  }

  static async getAll(filters) {
    const apiURL = "/api/purchase-invoices";
    return axios.get(apiURL, { params: filters });
  }

  static async getById(id) {
    const apiURL = `/api/purchase-invoices/${id}`;
    return axios.get(apiURL);
  }

  static async update(id, invoiceData) {
    const apiURL = `/api/purchase-invoices/${id}`;
    return axios.put(apiURL, invoiceData);
  }

  static async markAsPaid(id, paymentData) {
    const apiURL = `/api/purchase-invoices/${id}/pay`;
    return axios.post(apiURL, paymentData);
  }
}
