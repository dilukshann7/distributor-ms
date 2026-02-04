import axios from "axios";

/**
 * Order - Base order model for Class Table Inheritance
 * Contains common fields and methods for all order types
 *
 * Order Types:
 * - "purchase" -> PurchaseOrder (orders TO suppliers)
 * - "sales" -> SalesOrder (orders FROM customers)
 * - "retail" -> RetailOrder (walk-in/counter sales)
 */
export class Order {
  // Base order operations (queries all order types)
  static async getAll(filters) {
    const apiURL = "/api/orders";
    return axios.get(apiURL, { params: filters });
  }

  static async getById(id) {
    const apiURL = `/api/orders/${id}`;
    return axios.get(apiURL);
  }

  static async getByType(orderType) {
    const apiURL = `/api/orders?type=${orderType}`;
    return axios.get(apiURL);
  }

  // Analytics endpoints (for base orders)
  static async getDailyOrders() {
    const apiURL = "/api/orders/daily";
    return axios.get(apiURL);
  }

  static async getWeeklyOrders() {
    const apiURL = "/api/orders/weekly";
    return axios.get(apiURL);
  }

  static async getMonthlyOrders() {
    const apiURL = "/api/orders/monthly";
    return axios.get(apiURL);
  }

  static async getSummary() {
    const apiURL = "/api/orders/summary";
    return axios.get(apiURL);
  }

  // Update base order (status changes, etc.)
  static async update(id, orderData) {
    const apiURL = `/api/orders/${id}`;
    return axios.put(apiURL, orderData);
  }
}
