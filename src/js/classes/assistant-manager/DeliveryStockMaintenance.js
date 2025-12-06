import { Product } from "../../models/Product";

export class DeliveryStockMaintenance {
  constructor(container) {
    this.container = container;
    this.deliveryStock = [];
    this.getInventoryItems();
  }

  async getInventoryItems() {
    try {
      const response = await Product.getAll();
      console.log(response.data);
      this.deliveryStock = response.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      this.deliveryStock = [];
    }
  }

  render() {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Delivery & Stock Maintenance</h3>
          <p class="cashier-subtitle">Maintain stock levels for deliveries and distributions</p>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${this.deliveryStock
                  .map(
                    (item) => `
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.quantity} units</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.category}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.quantity}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.updatedAt}</td>
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
