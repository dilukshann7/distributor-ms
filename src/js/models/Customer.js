import axios from "axios";

// Customer/Buyer Class
export class Customer {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.businessName = data.businessName;
    this.customerType = data.customerType;
    this.isVIP = data.isVIP;
    this.totalPurchases = data.totalPurchases;
    this.totalSpent = data.totalSpent;
    this.lastVisit = data.lastVisit;
    this.loyaltyPoints = data.loyaltyPoints;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/customers";
    return axios.get(apiURL);
  }

  static async create(customerData) {
    const apiURL = "http://localhost:3000/api/customers";
    return axios.post(apiURL, customerData);
  }

  static async delete(customerID) {
    const apiURL = `http://localhost:3000/api/customers/${customerID}`;
    return axios.delete(apiURL);
  }
}
