import { Shipment } from "../../models/Shipment.js";

export class ShipmentTracking {
  constructor() {
    this.shipments = [];
  }

  async getShipments() {
    try {
      const response = await Shipment.getAll();
      this.shipments = response.data;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      this.shipments = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="section-header">Shipment Tracking</h3>
          <p class="section-subtitle">Track all shipments and delivery status</p>
        </div>

        <div class="card-container">
          <div class="card-header">
            <h3 class="card-title">Active Shipments</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="table-header">Shipment ID</th>
                  <th class="table-header">Order ID</th>
                  <th class="table-header">Items</th>
                  <th class="table-header">Carrier</th>
                  <th class="table-header">Est. Delivery</th>
                  <th class="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.shipments
                  .map(
                    (shipment) => `
                  <tr class="table-row">
                    <td class="table-cell-bold">${shipment.id}</td>
                    <td class="px-6 py-4 text-sm text-indigo-600 font-medium">${
                      shipment.purchaseOrderId
                    }</td>
                    <td class="table-cell">
                      ${shipment.order.items
                        .map((item) => `${item.name} (x${item.quantity})`)
                        .join(", ")}
                    </td>
                    <td class="table-cell">${shipment.carrier}</td>
                    <td class="table-cell">${shipment.expectedDeliveryDate}</td>
                    <td class="table-cell">
                      <span class="status-badge ${
                        shipment.status === "delivered"
                          ? "status-green"
                          : shipment.status === "in-transit"
                          ? "status-blue"
                          : "status-yellow"
                      }">
                        ${
                          shipment.status === "delivered"
                            ? "Delivered"
                            : shipment.status === "in-transit"
                            ? "In Transit"
                            : "Preparing"
                        }
                      </span>
                    </td>
                    
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}
