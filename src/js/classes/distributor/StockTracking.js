import { Product } from "../../models/Product.js";

export class StockTracking {
  constructor(container) {
    this.container = container;
    this.stockLocations = [];
    this.getInventoryItems();
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.stockLocations = response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.stockLocations = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-800">Stock Location Tracking</h3>
          <p class="text-gray-600 mt-1">Track specific stock locations for received orders</p>
        </div>

        <div class="dist-card">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Stock Locations by Order</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="dist-table-th">Order ID</th>
                  <th class="dist-table-th">Product</th>
                  <th class="dist-table-th">Quantity</th>
                  <th class="dist-table-th">Location</th>
                  <th class="dist-table-th">Last Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.stockLocations
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="dist-table-td font-semibold text-gray-800">${
                      item.id
                    }</td>
                    <td class="dist-table-td text-gray-700">${item.name}</td>
                    <td class="dist-table-td text-gray-700">${
                      item.quantity
                    } units</td>
                    <td class="dist-table-td text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      ${item.location}
                    </td>
                    <td class="dist-table-td text-gray-600 text-sm">${new Date(
                      item.updatedAt
                    ).toLocaleDateString()}</td>
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

  getStatusColor(status) {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
