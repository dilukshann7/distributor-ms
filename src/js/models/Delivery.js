import axios from "axios";

// Delivery Class
export class Delivery {
  constructor(data) {
    this.id = data.id;
    this.deliveryNumber = data.deliveryNumber;
    this.orderId = data.orderId;
    this.driverId = data.driverId;
    this.vehicleId = data.vehicleId;
    this.deliveryAddress = data.deliveryAddress;
    this.scheduledDate = data.scheduledDate;
    this.deliveredDate = data.deliveredDate;
    this.estimatedTime = data.estimatedTime;
    this.status = data.status;
    this.signature = data.signature;
    this.proofOfDelivery = data.proofOfDelivery;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/deliveries";

    return axios.get(apiURL);
  }
}
