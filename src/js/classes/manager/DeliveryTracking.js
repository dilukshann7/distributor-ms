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
          <h3 class="text-2xl font-bold text-gray-900">Delivery Tracking</h3>
          <p class="text-gray-600 mt-1">Monitor active deliveries and routes</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p class="text-gray-600 text-sm">Active Deliveries</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "in_transit").length}
            </p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p class="text-gray-600 text-sm">Completed Today</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "delivered").length}
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.filter((d) => d.status === "scheduled").length}
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <p class="text-gray-600 text-sm">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
            ${this.deliveries.length}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Driver</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Destination</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ETA</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveries
                  .map(
                    (delivery) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      delivery.deliveryNumber
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      delivery.driver.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      delivery.deliveryAddress
                    }</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        delivery.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : delivery.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }">
                        ${delivery.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      delivery.estimatedDeliveryTime
                    }</td>
                    <td class="px-6 py-4 text-sm">
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
