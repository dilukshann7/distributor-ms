import axios from "axios";

/**
 * Invoice - Base invoice model for Class Table Inheritance
 * Contains common fields and methods for all invoice types
 *
 * Invoice Types:
 * - "purchase" -> PurchaseInvoice (invoices FROM suppliers)
 * - "sales" -> SalesInvoice (invoices TO customers)
 */
export class Invoice {
  // Base invoice operations (queries all invoice types)
  static async getAll(filters) {
    const apiURL = "/api/invoices";
    return axios.get(apiURL, { params: filters });
  }

  static async getById(id) {
    const apiURL = `/api/invoices/${id}`;
    return axios.get(apiURL);
  }

  static async getByType(invoiceType) {
    const apiURL = `/api/invoices?type=${invoiceType}`;
    return axios.get(apiURL);
  }

  static async getByOrderId(orderId) {
    const apiURL = `/api/invoices?orderId=${orderId}`;
    return axios.get(apiURL);
  }

  // Update base invoice (status changes, etc.)
  static async update(id, invoiceData) {
    const apiURL = `/api/invoices/${id}`;
    return axios.put(apiURL, invoiceData);
  }

  // Analytics
  static async getSummary() {
    const apiURL = "/api/invoices/summary";
    return axios.get(apiURL);
  }

  static async getOverdue() {
    const apiURL = "/api/invoices/overdue";
    return axios.get(apiURL);
  }
}
