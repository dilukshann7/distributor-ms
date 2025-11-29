import { Product } from "../../models/Product.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class InventoryControl {
  constructor() {
    this.inventory = [];
  }

  async getInventory() {
    try {
      const response = await Product.getAll();
      this.inventory = response.data;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      this.inventory = [];
    }
  }

  async getProducts() {
    try {
      const response = await Product.getAll();
      this.inventory = response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.inventory = [];
    }
  }

  render() {
    return `
      <div class="p-8 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Inventory Control</h2>
            <p class="text-gray-500 mt-1">Manage stock levels and product details</p>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
            ${getIconHTML("plus")}
            Add Product
          </button>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Min Stock</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.inventory
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${
                      item.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-500">${item.sku}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      item.quantity
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${
                      item.minStock
                    } units</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${item.price.toLocaleString(
                      "en-US",
                      { style: "currency", currency: "LKR" }
                    )}</td>
                    <td class="px-6 py-4 text-sm">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }">
                        ${item.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm flex items-center gap-2">
                      <button class="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium">Edit</button>
                      <button class="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-medium">Delete</button>
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
