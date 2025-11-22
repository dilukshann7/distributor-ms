import axios from "axios";

export class smallOrder {
  constructor(data) {
    this.id = data.id;
    this.orderNumber = data.orderNumber;
    this.cartId = data.cartId;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  static async getAll() {
    const apiURL = "http://localhost:3000/api/small-orders";
    return axios.get(apiURL);
  }
}
