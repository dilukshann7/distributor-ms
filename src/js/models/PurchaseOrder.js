import axios from "axios";

/**
 * PurchaseOrder - Orders TO suppliers (extends base Order)
 * Used for restocking inventory from suppliers
 */
export class PurchaseOrder {
  static async create(orderData) {
    const apiURL = "/api/purchase-orders";
    return axios.post(apiURL, orderData);
  }

  static async getAll() {
    const apiURL = "/api/purchase-orders";
    return axios.get(apiURL);
  }

  static async getById(id) {
    const apiURL = `/api/purchase-orders/${id}`;
    return axios.get(apiURL);
  }

  static async update(id, orderData) {
    const apiURL = `/api/purchase-orders/${id}`;
    return axios.put(apiURL, orderData);
  }

  static async delete(id) {
    const apiURL = `/api/purchase-orders/${id}`;
    return axios.delete(apiURL);
  }

  static async getDailyOrders() {
    const apiURL = "/api/purchase-orders/daily";
    return axios.get(apiURL);
  }

  static async getWeeklyOrders() {
    const apiURL = "/api/purchase-orders/weekly";
    return axios.get(apiURL);
  }

  static async getMonthlyOrders() {
    const apiURL = "/api/purchase-orders/monthly";
    return axios.get(apiURL);
  }

  static async getSummary() {
    const apiURL = "/api/purchase-orders/summary";
    return axios.get(apiURL);
  }
}
