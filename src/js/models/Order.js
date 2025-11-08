import axios from "axios";

export class Order {
  constructor(data) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.orderDate = data.orderDate;
    this.status = data.status;
    this.totalAmount = data.totalAmount;
    this.dueDate = data.dueDate;
    this.itemIDs = data.itemIDs;
    this.items = data.items;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/orders";

    return axios.get(apiURL);
  }

  static async getDailyOrders() {
    const apiURL = "http://localhost:3000/api/orders/daily";

    return axios.get(apiURL);
  }

  static async getWeeklyOrders() {
    const apiURL = "http://localhost:3000/api/orders/weekly";

    return axios.get(apiURL);
  }

  static async getMonthlyOrders() {
    const apiURL = "http://localhost:3000/api/orders/monthly";

    return axios.get(apiURL);
  }

  static async getSummary() {
    const apiURL = "http://localhost:3000/api/orders/summary";

    return axios.get(apiURL);
  }
}
