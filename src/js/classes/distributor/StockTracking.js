import { LitElement, html } from "lit";
import { Product } from "../../models/Product.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class StockTracking extends LitElement {
  static properties = {
    stockLocations: { type: Array },
  };

  constructor() {
    super();
    this.stockLocations = [];
    this.getInventoryItems();
  }

  createRenderRoot() {
    return this;
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.stockLocations = response.data;
      this.requestUpdate();
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.stockLocations = [];
    }
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

  render() {
    return html`
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-800">
            Stock Location Tracking
          </h3>
          <p class="text-gray-600 mt-1">
            Track specific stock locations for received orders
          </p>
        </div>

        <div class="dist-card">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">
              Stock Locations by Order
            </h3>
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
                ${this.stockLocations.map(
                  (item) => html`
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="dist-table-td font-semibold text-gray-800">
                        ${item.id}
                      </td>
                      <td class="dist-table-td text-gray-700">${item.name}</td>
                      <td class="dist-table-td text-gray-700">
                        ${item.quantity} units
                      </td>
                      <td
                        class="dist-table-td text-gray-700 flex items-center gap-2"
                      >
                        <span
                          class="text-orange-500"
                          .innerHTML=${getIconHTML("map-pin").replace(
                            "w-5 h-5",
                            "w-4 h-4"
                          )}
                        ></span>
                        ${item.location}
                      </td>
                      <td class="dist-table-td text-gray-600 text-sm">
                        ${new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("stock-tracking", StockTracking);
