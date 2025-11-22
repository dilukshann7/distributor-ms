import axios from "axios";

// SalesOrder Class
export class SalesOrder {
  constructor(data) {
    this.id = data.id;
    this.orderNumber = data.orderNumber;
    this.customerId = data.customerId;
    this.customerName = data.customerName;
    this.salesmanId = data.salesmanId;
    this.orderDate = data.orderDate;
    this.subtotal = data.subtotal;
    this.tax = data.tax;
    this.discount = data.discount;
    this.totalAmount = data.totalAmount;
    this.status = data.status;
    this.paymentStatus = data.paymentStatus;
    this.items = data.items || [];
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/sales-orders";

    return axios.get(apiURL);
  }

  static async create(orderData) {
    const apiURL = "http://localhost:3000/api/sales-orders";

    return axios.post(apiURL, orderData);
  }

  static async update(id, orderData) {
    const apiURL = "http://localhost:3000/api/sales-orders/" + id;

    return axios.put(apiURL, orderData);
  }

  static async delete(id) {
    const apiURL = "http://localhost:3000/api/sales-orders/" + id;

    return axios.delete(apiURL);
  }
}
