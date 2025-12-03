import axios from "axios";

export class Shipment {
  static async create(shipmentData) {
    const apiURL = "http://localhost:3000/api/shipments";
    return axios.post(apiURL, shipmentData);
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/shipments";

    return axios.get(apiURL);
  }
}
