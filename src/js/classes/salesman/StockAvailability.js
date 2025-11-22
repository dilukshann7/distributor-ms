import { Product } from "../../models/Product.js";

export class StockAvailability {
  constructor() {
    this.products = [];
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      this.products = response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.products = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-3xl font-bold text-gray-900">Stock Availability</h3>
          <p class="text-gray-600 mt-1">Check real-time product inventory</p>
        </div>

        <!-- Stock Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Product Inventory</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                ${this.products
                  .map(
                    (product) => `
                  <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${
                      product.name
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      product.sku
                    }</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${
                      product.category
                    }</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">${
                      product.quantity
                    }</td>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-sky-600">Rs. ${product.price.toFixed(
                      2
                    )}</td>
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
