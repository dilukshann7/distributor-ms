import { Product } from "../../models/Product.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class InventoryControl {
  constructor(container) {
    this.container = container;
    this.inventory = [];
    this.getInventory();
    this.getProducts();
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
      <div class="owner-section-container">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="owner-title">Inventory Control</h2>
            <p class="owner-subtitle">Manage stock levels and product details</p>
          </div>
          <button class="owner-btn-primary">
            ${getIconHTML("plus")}
            Add Product
          </button>
        </div>

        <div class="owner-card">
          <div class="overflow-x-auto">
            <table class="owner-table">
              <thead class="owner-table-head">
                <tr>
                  <th class="owner-table-th">Product Name</th>
                  <th class="owner-table-th">SKU</th>
                  <th class="owner-table-th">Quantity</th>
                  <th class="owner-table-th">Min Stock</th>
                  <th class="owner-table-th">Price</th>
                  <th class="owner-table-th">Status</th>
                  <th class="owner-table-th">Actions</th>
                </tr>
              </thead>
              <tbody class="owner-table-body">
                ${this.inventory
                  .map(
                    (item) => `
                  <tr class="owner-table-tr">
                    <td class="owner-table-td font-medium text-gray-900">${
                      item.name
                    }</td>
                    <td class="owner-table-td text-gray-500">${item.sku}</td>
                    <td class="owner-table-td text-gray-900">${
                      item.quantity
                    } units</td>
                    <td class="owner-table-td text-gray-900">${
                      item.minStock
                    } units</td>
                    <td class="owner-table-td text-gray-900">${item.price.toLocaleString(
                      "en-US",
                      { style: "currency", currency: "LKR" }
                    )}</td>
                    <td class="owner-table-td">
                      <span class="owner-badge ${
                        item.status === "In Stock"
                          ? "owner-badge-success"
                          : item.status === "Low Stock"
                          ? "owner-badge-warning"
                          : "owner-badge-danger"
                      }">
                        ${item.status}
                      </span>
                    </td>
                    <td class="owner-table-td flex items-center gap-2">
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
