import { Delivery } from "../../models/Delivery.js";

export class DeliveryTracking {
  constructor(container) {
    this.container = container;
    this.deliveries = [];
    this.getDeliveries();
  }

  async getDeliveries() {
    try {
      const response = await Delivery.getAll();
      this.deliveries = response.data;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="manager-header-title">Delivery Tracking</h3>
          <p class="manager-header-subtitle">Monitor active deliveries and routes</p>
        </div>

        <div class="manager-card-overflow">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="manager-table-header">
                <tr>
                  <th class="manager-table-th">Order ID</th>
                  <th class="manager-table-th">Driver</th>
                  <th class="manager-table-th">Destination</th>
                  <th class="manager-table-th">Status</th>
                  <th class="manager-table-th">Scheduled Date</th>
                  <th class="manager-table-th">Actual Delivery Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveries
                  .map(
                    (delivery) => `
                  <tr class="manager-table-row">
                    <td class="manager-table-td font-medium text-gray-900">${
                      delivery.deliveryNumber
                    }</td>
                    <td class="manager-table-td text-gray-600">${
                      delivery.driver.user.name
                    }</td>
                    <td class="manager-table-td text-gray-900">${
                      delivery.deliveryAddress
                    }</td>
                    <td class="manager-table-td">
                      <span class="manager-badge ${
                        delivery.status === "Delivered"
                          ? "manager-badge-green"
                          : delivery.status === "In Transit"
                          ? "manager-badge-blue"
                          : "manager-badge-yellow"
                      }">
                        ${delivery.status}
                      </span>
                    </td>
                    <td class="manager-table-td text-gray-600">${new Date(
                      delivery.scheduledDate
                    ).toLocaleString()}</td>
                    <td class="manager-table-td text-gray-600">${new Date(
                      delivery.deliveredDate
                    ).toLocaleString()}</td>
                    
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
