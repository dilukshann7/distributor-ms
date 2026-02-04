import axios from "axios";

/**
 * SalesInvoice - Invoices TO customers (extends base Invoice)
 * Used for billing customers on their orders
 */
export class SalesInvoice {
  static async getAll(filters) {
    const apiURL = "/api/sales-invoices";
    return axios.get(apiURL, { params: filters });
  }

  static async getById(id) {
    const apiURL = `/api/sales-invoices/${id}`;
    return axios.get(apiURL);
  }

  static async getByDriver(driverId) {
    const apiURL = `/api/sales-invoices/driver/${driverId}`;
    return axios.get(apiURL);
  }

  static async create(invoiceData) {
    const apiURL = "/api/sales-invoices";
    return axios.post(apiURL, invoiceData);
  }

  static async update(id, invoiceData) {
    const apiURL = `/api/sales-invoices/${id}`;
    return axios.put(apiURL, invoiceData);
  }

  static async collect(id, collectionData) {
    const apiURL = `/api/sales-invoices/${id}/collect`;
    return axios.post(apiURL, collectionData);
  }
}
