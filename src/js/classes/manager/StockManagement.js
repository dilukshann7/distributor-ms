import { Product } from "../../models/Product.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class StockManagement {
  constructor() {
    this.inventory = [];
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
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="manager-header-title">Stock Management</h3>
            <p class="manager-header-subtitle">Monitor and manage inventory levels</p>
          </div>
          <button class="manager-btn-primary">
            ${getIconHTML("plus")}
            Add Product
          </button>
        </div>

        <div class="manager-card-overflow">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="manager-table-header">
                <tr>
                  <th class="manager-table-th">Product Name</th>
                  <th class="manager-table-th">SKU</th>
                  <th class="manager-table-th">Quantity</th>
                  <th class="manager-table-th">Min Stock</th>
                  <th class="manager-table-th">Status</th>
                  <th class="manager-table-th">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.inventory
                  .map(
                    /*html*/
                    (item) => `
                  <tr class="manager-table-row">
                    <td class="manager-table-td font-medium text-gray-900">${
                      item.name
                    }</td>
                    <td class="manager-table-td text-gray-600">${item.sku}</td>
                    <td class="manager-table-td text-gray-900">${
                      item.quantity
                    } units</td>
                    <td class="manager-table-td text-gray-900">${
                      item.minStock
                    } units</td>
                    <td class="manager-table-td">
                      <span class="manager-badge ${
                        item.status === "In Stock"
                          ? "manager-badge-green"
                          : item.status === "Low Stock"
                          ? "manager-badge-yellow"
                          : "manager-badge-red"
                      }">
                        ${item.status}
                      </span>
                    </td>
                    <td class="manager-table-td flex gap-2">
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
