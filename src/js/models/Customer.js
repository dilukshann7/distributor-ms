import axios from "axios";

export class Customer {
  static async getAll(filters) {
    const apiURL = "/api/customers";
    return axios.get(apiURL);
  }

  static async create(customerData) {
    const apiURL = "/api/customers";
    return axios.post(apiURL, customerData);
  }

  static async delete(customerID) {
    const apiURL = `/api/customers/${customerID}`;
    return axios.delete(apiURL);
  }
}
