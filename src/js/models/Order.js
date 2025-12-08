import axios from "axios";

export class Order {
  static async create(orderData) {
    const apiURL = "/api/orders";
    return axios.post(apiURL, orderData);
  }

  static async getAll() {
    const apiURL = "/api/orders";

    return axios.get(apiURL);
  }

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

  static async update(id, orderData) {
    const apiURL = `/api/orders/${id}`;
    return axios.put(apiURL, orderData);
  }
}
