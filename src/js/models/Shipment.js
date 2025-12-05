import axios from "axios";

export class Shipment {
  static async create(shipmentData) {
    const apiURL = "/api/shipments";
    return axios.post(apiURL, shipmentData);
  }

  static async getAll(filters) {
    const apiURL = "/api/shipments";

    return axios.get(apiURL);
  }
}
