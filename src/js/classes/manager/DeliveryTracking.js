import { Delivery } from "../../models/Delivery.js";

export class DeliveryTracking {
  constructor() {
    this.deliveries = [];
  }

  async getDeliveries() {
    try {
      const response = await Delivery.getAll();
      this.deliveries = response.data;
      console.log("Fetched deliveries:", this.deliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      this.deliveries = [];
    }
  }

  render() {
    /*html*/
    return `
      <div class="space-y-6">
        <div>
          <h3 class="manager-header-title">Delivery Tracking</h3>
          <p class="manager-header-subtitle">Monitor active deliveries and routes</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="manager-card border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Active Deliveries</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "in_transit").length}
            </p>
          </div>
          <div class="manager-card border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Completed Today</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "delivered").length}
          </div>
          <div class="manager-card border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "scheduled").length}
          </div>
          <div class="manager-card border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.length}</p>
          </div>
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
                  <th class="manager-table-th">ETA</th>
                  <th class="manager-table-th">Actions</th>
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
                      delivery.driver.name
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
                    <td class="manager-table-td text-gray-600">${
                      delivery.estimatedDeliveryTime
                    }</td>
                    <td class="manager-table-td">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
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
