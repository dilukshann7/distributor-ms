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

  // Static methods
  static async create(deliveryData) {}
  static async findById(id) {}
  static async findByDeliveryNumber(deliveryNumber) {}
  static async getAll(filters) {
    const apiURL = "http://localhost:3000/api/deliveries";

    return axios.get(apiURL);
  }
  static async getByDriver(driverId) {}
  static async getByStatus(status) {}
  static async getPending() {}
  static async getInTransit() {}
  static async getCompleted() {}
  static async getTodaysDeliveries() {}

  // Instance methods
  async update(updateData) {}
  async delete() {}
  async markPending() {}
  async markInTransit() {}
  async markDelivered(signature, proof) {}
  async markFailed(reason) {}
  async assignDriver(driverId) {}
  async assignVehicle(vehicleId) {}
  async updateRoute(routeData) {}
  async updateEstimatedTime(time) {}
  async getOrder() {}
  async getDriver() {}
  async getVehicle() {}
  async uploadProofOfDelivery(file) {}
  async uploadSignature(file) {}
  async calculateDistance() {}
  async estimateDeliveryTime() {}
  async notifyCustomer() {}
  async sendDriverUpdate() {}
  async trackLocation() {}
  async getDeliveryHistory() {}
}
