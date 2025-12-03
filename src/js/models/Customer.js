import axios from "axios";

export class Customer {
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
