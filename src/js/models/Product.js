// Product/Inventory Class
import axios from "axios";

export class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.sku = data.sku;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.quantity = data.quantity;
    this.minStock = data.minStock;
    this.maxStock = data.maxStock;
    this.location = data.location;
    this.supplierId = data.supplierId;
    this.batchNumber = data.batchNumber;
    this.expiryDate = data.expiryDate;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/products";

    return axios.get(apiURL);
  }
}
