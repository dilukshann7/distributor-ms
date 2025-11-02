// Shipment Class
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

  // Static methods
  static async create(shipmentData) {}
  static async findById(id) {}
  static async findByShipmentNumber(number) {}
  static async getAll(filters) {}
  static async getPending() {}
  static async getInTransit() {}
  static async getBySupplier(supplierId) {}

  // Instance methods
  async update(updateData) {}
  async delete() {}
  async markInTransit() {}
  async markDelivered() {}
  async reportIssue(issueDescription) {}
  async resolveIssue() {}
  async getPurchaseOrder() {}
  async getSupplier() {}
  async updateTracking(trackingNumber) {}
  async estimateDelivery() {}
}
