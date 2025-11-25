import axios from "axios";

export class Shipment {
  constructor(data) {
    this.id = data.id;
    this.shipmentNumber = data.shipmentNumber;
    this.purchaseOrderId = data.purchaseOrderId;
    this.supplierId = data.supplierId;
    this.shipmentDate = data.shipmentDate;
    this.expectedDeliveryDate = data.expectedDeliveryDate;
    this.actualDeliveryDate = data.actualDeliveryDate;
    this.trackingNumber = data.trackingNumber;
    this.carrier = data.carrier;
    this.status = data.status;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async create(shipmentData) {
    const apiURL = "http://localhost:3000/api/shipments";
    return axios.post(apiURL, shipmentData);
  }

  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/shipments";

    return axios.get(apiURL);
  }
}
