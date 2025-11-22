import axios from "axios";

export class Cart {
  constructor(data) {
    this.id = data.id;
    this.items = data.items; // Array of items
    this.totalAmount = data.totalAmount;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll() {
    const apiURL = "http://localhost:3000/api/carts";
    return axios.get(apiURL);
  }
}
